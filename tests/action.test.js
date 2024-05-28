import fs from "fs";
import sinon from "sinon";
import { expect } from "chai";

import Action from "../src/action.js";

describe("Action Class", () => {
  const mockPaths = "/path1,/path2";
  const mockSeparator = ",";

  const mockSubFoldersPath1 = {
    subfolder1: { name: "subfolder1", isDirectory: () => true },
    "file1.txt": { name: "file1.txt", isDirectory: () => false },
    subfolder2: { name: "subfolder2", isDirectory: () => true },
  };
  const mockSubFoldersPath2 = {
    subfolderA: { name: "subfolderA", isDirectory: () => true },
    "file2.txt": { name: "file2.txt", isDirectory: () => false },
    subfolderB: { name: "subfolderB", isDirectory: () => true },
  };

  beforeEach(() => {
    const existsSyncStub = sinon.stub(fs, "existsSync");
    existsSyncStub.withArgs("/path1").returns(true);
    existsSyncStub.withArgs("/path2").returns(true);
    existsSyncStub.withArgs("path3").returns(false);

    const readdirSyncStub = sinon.stub(fs, "readdirSync");

    readdirSyncStub
      .withArgs("/path1")
      .returns(Object.keys(mockSubFoldersPath1));

    readdirSyncStub
      .withArgs("/path2")
      .returns(Object.keys(mockSubFoldersPath2));

    const statSyncStub = sinon.stub(fs, "statSync");

    Object.keys(mockSubFoldersPath1).forEach((item) => {
      statSyncStub
        .withArgs(`/path1/${item}`)
        .returns(mockSubFoldersPath1[item]);
    });

    Object.keys(mockSubFoldersPath2).forEach((item) => {
      statSyncStub
        .withArgs(`/path2/${item}`)
        .returns(mockSubFoldersPath2[item]);
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should split base paths correctly", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.foldersByPath).to.have.property("/path1");
    expect(result.foldersByPath).to.have.property("/path2");
  });

  it("should list subfolders for each base path", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.foldersByPath["/path1"]).to.deep.equal([
      "subfolder1",
      "subfolder2",
    ]);
    expect(result.foldersByPath["/path2"]).to.deep.equal([
      "subfolderA",
      "subfolderB",
    ]);
  });

  it("should omit specified subfolders", () => {
    const omit = ["subfolder2", "subfolderB"];
    const action = new Action(mockPaths, mockSeparator, omit);
    const result = action.run();

    expect(result.foldersByPath["/path1"]).to.deep.equal(["subfolder1"]);
    expect(result.foldersByPath["/path2"]).to.deep.equal(["subfolderA"]);
  });

  it("should calculate the total number of subfolders correctly", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.total).to.be.equal(4); // 2 subfolders in /path1 + 2 subfolders in /path2
  });

  it("should correctly format folders with base paths", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.folders).to.deep.equal([
      "/path1/subfolder1",
      "/path1/subfolder2",
      "/path2/subfolderA",
      "/path2/subfolderB",
    ]);
  });

  it("should correctly list folders without base paths", () => {
    const action = new Action(mockPaths, mockSeparator);
    const result = action.run();

    expect(result.foldersNoBasePath).to.deep.equal([
      "subfolder1",
      "subfolder2",
      "subfolderA",
      "subfolderB",
    ]);
  });

  it("should trow an exception if base path not exists", () => {
    const action = new Action(" path3 ", `\n`);

    expect(() => action.run()).to.throw(`base path 'path3' not exists`);
  });

  it("should omit if base path is empty", () => {
    const action = new Action("", mockSeparator);
    const result = action.run();

    expect(result.total).to.be.equal(0);
  });
});

describe("Action Class no mocks", () => {
  it("should list subfolders", () => {
    const basePath = "tests/testdata";

    const action = new Action(basePath, ",");
    const result = action.run();

    expect(result.total).to.equal(2);
    expect(result.folders).to.deep.equal([
      `${basePath}/sub1`,
      `${basePath}/sub2`,
    ]);
    expect(result.foldersNoBasePath).to.deep.equal(["sub1", "sub2"]);
    expect(result.foldersByPath).to.deep.equal({
      "tests/testdata": ["sub1", "sub2"],
    });
  });
});
