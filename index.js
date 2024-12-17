import * as core from "@actions/core";

import Action from "./src/action.js";
import { getInput, getBooleanInput, getArrayInput } from "./src/utils.js";

const main = async () => {
  let separator = getInput("separator", `\n`);

  let paths = getArrayInput("paths", [], separator);
  let omit = getArrayInput("omit", [], separator);
  let recursive = getBooleanInput("recursive", false);

  const action = new Action(paths, omit, recursive);

  try {
    const result = action.run();

    core.setOutput("total", result.total);
    core.setOutput("folders", result.folders);
    core.setOutput("folders_no_base_path", result.foldersNoBasePath);
    core.setOutput("folders_by_path", result.foldersByPath);
  } catch (e) {
    core.error(`[ERROR] Unexpected failure listing subfolders: ${e.message}`);
    process.exit(1);
  }
};

(async () => {
  await main();
})();
