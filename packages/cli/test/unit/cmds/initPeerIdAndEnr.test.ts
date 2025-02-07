import fs from "node:fs";
import {createChainForkConfig} from "@lodestar/config";
import {chainConfig} from "@lodestar/config/default";
import tmp from "tmp";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {initPeerIdAndEnr} from "../../../src/cmds/beacon/initPeerIdAndEnr.js";
import {BeaconArgs} from "../../../src/cmds/beacon/options.js";
import {testLogger} from "../../utils.js";

const chainForkConfig = createChainForkConfig(chainConfig);

describe("initPeerIdAndEnr", () => {
  let tmpDir: tmp.DirResult;

  beforeEach(() => {
    tmpDir = tmp.dirSync();
  });

  afterEach(() => {
    fs.rmSync(tmpDir.name, {recursive: true});
  });

  it("first time should create a new enr and peer id", async () => {
    const {enr, peerId} = await initPeerIdAndEnr(
      chainForkConfig,
      {persistNetworkIdentity: true} as unknown as BeaconArgs,
      tmpDir.name,
      testLogger(),
      true
    );
    // "enr peer id doesn't equal the returned peer id"
    expect((await enr.peerId()).toString()).toBe(peerId.toString());
    expect(enr.seq).toBe(BigInt(1));
    expect(enr.tcp).toBeUndefined();
    expect(enr.tcp6).toBeUndefined();
  });

  it("second time should use ths existing enr and peer id", async () => {
    const run1 = await initPeerIdAndEnr(
      chainForkConfig,
      {persistNetworkIdentity: true} as unknown as BeaconArgs,
      tmpDir.name,
      testLogger(),
      true
    );

    const run2 = await initPeerIdAndEnr(
      chainForkConfig,
      {persistNetworkIdentity: true} as unknown as BeaconArgs,
      tmpDir.name,
      testLogger(),
      true
    );

    expect(run1.peerId.toString()).toBe(run2.peerId.toString());
    expect(run1.enr.encodeTxt()).toBe(run2.enr.encodeTxt());
  });
});
