import fs, { existsSync } from "fs";
import sinon from "sinon";

import Action from "./action.js";

describe("Action Class", () => {
  const mockPaths = "/path1,/path2";
  const mockSeparator = ",";
  const mockSubFoldersPath1 = [
    { name: "subfolder1", isDirectory: () => true },
    { name: "file1.txt", isDirectory: () => false },
    { name: "subfolder2", isDirectory: () => true },
  ];
  const mockSubFoldersPath2 = [
    { name: "subfolderA", isDirectory: () => true },
    { name: "file2.txt", isDirectory: () => false },
    { name: "subfolderB", isDirectory: () => true },
  ];

  beforeEach(() => {
    const existsSyncStub = sinon.stub(fs, "existsSync");
    existsSyncStub.withArgs("/path1").returns(true);
    existsSyncStub.withArgs("/path2").returns(true);
    existsSyncStub.withArgs("path3").returns(false);

    const readdirSyncStub = sinon.stub(fs, "readdirSync");

    readdirSyncStub.withArgs("/path1").returns(mockSubFoldersPath1);
    readdirSyncStub.withArgs("/path2").returns(mockSubFoldersPath2);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should split base paths correctly", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.foldersByPath).toHaveProperty("/path1");
    expect(result.foldersByPath).toHaveProperty("/path2");
  });

  it("should list subfolders for each base path", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.foldersByPath["/path1"]).toEqual([
      "subfolder1",
      "subfolder2",
    ]);
    expect(result.foldersByPath["/path2"]).toEqual([
      "subfolderA",
      "subfolderB",
    ]);
  });

  it("should calculate the total number of subfolders correctly", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.total).toBe(4); // 2 subfolders in /path1 + 2 subfolders in /path2
  });

  it("should correctly format folders with base paths", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.folders).toEqual([
      "/path1/subfolder1",
      "/path1/subfolder2",
      "/path2/subfolderA",
      "/path2/subfolderB",
    ]);
  });

  it("should correctly list folders without base paths", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.foldersNoBasePath).toEqual([
      "subfolder1",
      "subfolder2",
      "subfolderA",
      "subfolderB",
    ]);
  });

  it("should trow an exception if base path not exists", () => {
    const action = new Action(" path3 ", `\n`);

    expect(action.run).toThrow(Error);
  });

  it("should omit if base path is empty", () => {
    const action = new Action("", mockSeparator);
    const result = action.run();

    expect(result.total).toEqual(0);
  });
});
