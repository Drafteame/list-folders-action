import fs from "fs";
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
    const files = fs.readdirSync(basePath);

    const subFolders = files
      .filter((file) => file.isDirectory())
      .map((folder) => folder.name);

    return subFolders;
  }
}
