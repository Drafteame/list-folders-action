import core from "@actions/core";
import lo from "lodash";

import Action from "./src/action.js";

const main = async () => {
  let paths = core.getInput("paths");
  let separator = core.getInput("separator");

  if (lo.isEmpty(separator)) {
    separator = `\n`;
  }

  const action = new Action(paths, separator);

  try {
    action.run();
  } catch (e) {
    core.error(`[ERROR] Unexpected failure listing subfolders: ${e.message}`);
    process.exit(1);
  }
};

main();
