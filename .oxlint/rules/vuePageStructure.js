import fs from "node:fs";

export const vuePageStructure = {
  meta: {
    type: "layout",
    docs: {
      description: "Enforces regional comments and ordering for Vue pages, excluding components. Reorders and creates missing regions with opening and closing tags.",
      category: "Style",
      recommended: true
    },
    fixable: "code",
    messages: {
      structureInvalid: "Page structure is invalid. Preferred order: {{expected}}"
    }
  },

  create(context) {
    if (!context.filename.endsWith(".vue")) return {}

    const normalizedPath = context.filename.replace(/\\/g, "/");
    const isInPages = normalizedPath.includes("/pages/");
    const isInComponents = normalizedPath.includes("/components/");

    if (!isInPages || isInComponents) return {}

    return {
      Program(node) {
        const sourceCode = context.sourceCode
        const fullText = sourceCode.getText()

        // Check for <script setup> context
        let isSetup = false;
        try {
          const originalFile = fs.readFileSync(context.filename, "utf-8");
          const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
          let m;
          while ((m = scriptRegex.exec(originalFile)) !== null) {
            if (m[1].includes("setup") && m[2].trim() === fullText.trim()) {
              isSetup = true;
              break;
            }
          }
        } catch (e) {
          isSetup = !fullText.includes("export default");
        }

        if (!isSetup) return;

        const expectedRegions = ["State", "Meta", "Lifecycle", "Logic"];

        const markerRegex = /\/\*\s*region\s+([\w\s]+)\s*\*\//gi;
        const endMarkerRegex = /\/\*\s*endregion\s*\*\//gi;

        const foundMarkers = [];
        let match;
        while ((match = markerRegex.exec(fullText)) !== null) {
          foundMarkers.push({
            name: match[1].trim(),
            index: match.index,
            fullMatch: match[0],
            endIndex: match.index + match[0].length
          });
        }

        let hasIssue = false;
        if (foundMarkers.length !== expectedRegions.length) {
          hasIssue = true;
        } else {
          for (let i = 0; i < expectedRegions.length; i++) {
            if (foundMarkers[i].name.toLowerCase() !== expectedRegions[i].toLowerCase()) {
              hasIssue = true;
              break;
            }
          }
        }
        
        const endMarkersCount = (fullText.match(endMarkerRegex) || []).length;
        if (endMarkersCount < expectedRegions.length) {
          hasIssue = true;
        }

        if (hasIssue) {
          context.report({
            node,
            messageId: "structureInvalid",
            data: { expected: expectedRegions.join(", ") },
            fix(fixer) {
              const firstMarkerPos = foundMarkers.length > 0 ? foundMarkers[0].index : fullText.length;
              const header = fullText.slice(0, firstMarkerPos).trimEnd();
              
              const contentsByRegion = {};
              for (let i = 0; i < foundMarkers.length; i++) {
                const nextPos = (i + 1 < foundMarkers.length) ? foundMarkers[i+1].index : fullText.length;
                let content = fullText.slice(foundMarkers[i].endIndex, nextPos).trim();
                content = content.replace(/\/\*\s*endregion\s*\*\//gi, "").trim();
                
                const key = foundMarkers[i].name.toLowerCase();
                if (contentsByRegion[key]) {
                  contentsByRegion[key].content += '\n\n' + content;
                } else {
                  contentsByRegion[key] = { originalName: foundMarkers[i].name, content };
                }
              }
              
              let result = "";
              if (header.length > 0) {
                result = header + '\n\n';
              } else {
                result = '\n';
              }
              
              expectedRegions.forEach((r, idx) => {
                const key = r.toLowerCase();
                result += `/* region ${r} */\n`;
                if (contentsByRegion[key]) {
                  if (contentsByRegion[key].content) result += contentsByRegion[key].content + '\n';
                  delete contentsByRegion[key];
                }
                result += `/* endregion */\n`;
                if (idx < expectedRegions.length - 1) result += '\n';
              });
              
              const remainingKeys = Object.keys(contentsByRegion);
              if (remainingKeys.length > 0) {
                result += '\n';
                remainingKeys.forEach(k => {
                  result += `/* region ${contentsByRegion[k].originalName} */\n${contentsByRegion[k].content}\n/* endregion */\n\n`;
                });
              }
              
              if (!result.endsWith('\n')) result += '\n';
              return fixer.replaceTextRange([0, fullText.length], result);
            }
          });
        }
      }
    }
  }
}
