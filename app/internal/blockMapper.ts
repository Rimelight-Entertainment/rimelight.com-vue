import { defineAsyncComponent, type Component } from "vue";
import { type BlockType } from "../types/blocks";

import { BLOCK_RENDERER_COMPONENT_MAP } from "#build/rimelight-block-renderer-map";
import { BLOCK_EDITOR_COMPONENT_MAP } from "#build/rimelight-block-editor-map";

type ComponentImporter = () => Promise<{ default: Component }>;

/**
 * Maps the block type string from the database to a dynamically imported Vue component.
 *
 * @param type The BlockType string from the content JSON (e.g., 'ParagraphBlock').
 * @returns A lazily loaded Vue component reference, or undefined if not found.
 */
const rendererCache = new Map<string, Component>();

export const getBlockRendererComponent = (
  type: BlockType | (string & {}),
): Component | undefined => {
  if (rendererCache.has(type)) return rendererCache.get(type);

  const componentImporter = BLOCK_RENDERER_COMPONENT_MAP[type] as ComponentImporter | undefined;

  if (!componentImporter) {
    console.warn(
      `[BlockMapper] Block component not found for type: ${type}. Please check block name.`,
    );
    return undefined;
  }

  const component = defineAsyncComponent(async () => {
    const module = await componentImporter();
    return module.default;
  });

  rendererCache.set(type, component);
  return component;
};

const editorCache = new Map<string, Component>();

export const getBlockEditorComponent = (type: BlockType | (string & {})): Component | undefined => {
  if (editorCache.has(type)) return editorCache.get(type);

  const componentImporter = BLOCK_EDITOR_COMPONENT_MAP[type] as ComponentImporter | undefined;

  if (!componentImporter) {
    console.warn(
      `[EditorBlockMapper] Editor block component not found for type: ${type}. Please check block name.`,
    );
    return undefined;
  }

  const component = defineAsyncComponent(async () => {
    const module = await componentImporter();
    return module.default;
  });

  editorCache.set(type, component);
  return component;
};
