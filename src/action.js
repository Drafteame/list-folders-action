import fs from "fs";
import lodash from "lodash";

/**
 * Action class for handling directory operations
 * Manages listing subfolders from given paths with filtering and recursive options
 */

export default class Action {
  /**
   * Creates a new Action instance
   * @param {string[]} paths - Base path(s) to search for subfolders
   * @param {string} separator - Separator used to split multiple paths
   * @param {string[]} omit - List of regex patterns to exclude matching folders
   * @param {boolean} recursive - Whether to search recursively in subfolders
   */
  constructor(paths, omit = [], recursive = false) {
    this._paths = paths;
    this._omit = omit.map((pattern) => new RegExp(pattern));
    this._recursive = recursive;
  }

  /**
   * Executes the folder search operation
   * @returns {Object} Result containing:
   *   - total: Total number of subfolders found
   *   - folders: Array of full folder paths
   *   - foldersNoBasePath: Array of relative folder paths
   *   - foldersByPath: Object mapping base paths to their subfolders
   */
  run() {
    let folders = [];
    let foldersNoBasePath = [];
    let foldersByPath = {};
    let total = 0;

    this._paths.forEach((basePath) => {
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

  /**
   * Gets all subfolders in the given base path, excluding folders matching omit patterns
   * @param {string} basePath - Path to search for subfolders
   * @returns {string[]} Array of subfolder names/paths relative to base path
   * @private
   */
  #getSubFolders(basePath) {
    if (lodash.isEmpty(basePath)) {
      return [];
    }

    if (!fs.existsSync(basePath)) {
      return [];
    }

    const files = fs.readdirSync(basePath);
    let folders = [];

    files.forEach((entry) => {
      const fullPath = `${basePath}/${entry}`;
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        if (!this._omit.some((regex) => regex.test(entry))) {
          folders.push(entry);
        }

        if (this._recursive) {
          const subFolders = this.#getSubFolders(fullPath);
          folders.push(
            ...subFolders.map((subFolder) => `${entry}/${subFolder}`),
          );
        }
      }
    });

    return folders;
  }
}
