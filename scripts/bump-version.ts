import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const PROJECT_ROOT = process.cwd();
const TAURI_CONF_PATH = join(PROJECT_ROOT, "src-tauri", "tauri.conf.json");
const PACKAGE_JSON_PATH = join(PROJECT_ROOT, "package.json");

async function syncVersion() {
  try {
    const pkgRaw = await readFile(PACKAGE_JSON_PATH, "utf-8");
    const pkg = JSON.parse(pkgRaw);

    // Safety Check: Log if version is missing
    if (!pkg.version) {
      console.error("❌ Error: 'version' field not found in package.json");
      console.log("Current package.json keys:", Object.keys(pkg));
      process.exit(1);
    }

    const tauriConfRaw = await readFile(TAURI_CONF_PATH, "utf-8");
    const tauriConf = JSON.parse(tauriConfRaw);

    const version = pkg.version;
    const cleanVersion = version.split("-")[0];
    const [major, minor, patch] = cleanVersion.split(".").map(Number);

    // Formula: Major(1) Minor(000) Patch(000)
    const newVersionCode = major * 1000000 + minor * 1000 + patch;

    tauriConf.version = version;

    if (!tauriConf.bundle) tauriConf.bundle = {};
    if (!tauriConf.bundle.android) tauriConf.bundle.android = {};

    tauriConf.bundle.android.versionCode = newVersionCode;

    await writeFile(TAURI_CONF_PATH, JSON.stringify(tauriConf, null, 2));

    console.log(`✅ Version Synced: ${version} -> Android VersionCode: ${newVersionCode}`);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.error(`❌ File not found: ${error.path}`);
      console.error(
        "Ensure you are running the command from the project root and src-tauri/tauri.conf.json exists.",
      );
    } else {
      console.error("❌ An unexpected error occurred:");
      console.error(error);
    }
    process.exit(1);
  }
}

syncVersion();
