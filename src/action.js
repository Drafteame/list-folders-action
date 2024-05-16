import fs from "fs";

import { isEmpty } from "./utils.js";

/**
 * Main action
 */
export default class Action {
  constructor(paths, separator) {
    this._paths = paths;
    this._separator = separator;
  }

  run() {
    const basePaths = this.#splitBasePaths();

    let folders = [];
    let foldersNoBasePath = [];
    let foldersByPath = {};
    let total = 0;

    basePaths.forEach((basePath) => {
      const subFolders = this.#getSubFolders(basePath);

      total += subFolders.length;
      foldersByPath[basePath] = subFolders;
      foldersNoBasePath.push(...subFolders);
      folders.push(...subFolders.map((folder) => `${basePath}/${folder}`));
    });

    return {
      total,
      folders,
      foldersNoBasePath,
      foldersByPath,
    };
  }

  #splitBasePaths() {
    return this._paths.split(this._separator).map((path) => path.trim());
  }

  #getSubFolders(basePath) {
    if (isEmpty(basePath)) {
      return [];
    }

    if (!fs.existsSync(basePath)) {
      throw new Error(`base path '${basePath}' not exists`);
    }

    const files = fs.readdirSync(basePath);

    const subFolders = files
      .map((file) => {
        return {
          name: file,
          stats: fs.statSync(`${basePath}/${file}`),
        };
      })
      .filter((file) => file.stats.isDirectory())
      .map((file) => {
        return file.name;
      });

    return subFolders;
  }
}
