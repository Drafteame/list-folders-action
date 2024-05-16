import * as core from "@actions/core";
import * as lo from "lodash";

import Action from "./src/action.js";

const main = async () => {
  let paths = core.getInput("paths");
  let separator = core.getInput("separator");

  if (lo.isEmpty(separator)) {
    separator = `\n`;
  }

  const action = new Action(paths, separator);

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

main();