import path from "node:path";
import {fromHexString, toHexString} from "@chainsafe/ssz";
import {ACTIVE_PRESET} from "@lodestar/params";
import {InputType} from "@lodestar/spec-test-util";
import {expect} from "vitest";
import {ethereumConsensusSpecsTests} from "../specTestVersioning.js";
import {specTestIterator} from "../utils/specTestIterator.js";
import {RunnerType, TestRunnerFn} from "../utils/types.js";
import {getCustodyGroups, computeColumnsForCustodyGroup} from "../../../src/util/dataColumns.js";
import {bigIntToBytes} from "@lodestar/utils";

type ComputeColumnForCustodyGroupInput = {
  custody_group: number;
};

type GetCustodyGroupInput = {
  node_id: bigint;
  custody_group_count: number;
};

type NetworkFn = (input: any) => number[];

const networkingFns: Record<string, NetworkFn> = {
  computeColumnsForCustodyGroup(input: ComputeColumnForCustodyGroupInput): number[] {
    return computeColumnsForCustodyGroup(input.custody_group);
  },
  getCustodyGroups(input: GetCustodyGroupInput): number[] {
    return getCustodyGroups(bigIntToBytes(input.node_id, 32, "be"), input.custody_group_count);
  },
};

const networking: TestRunnerFn<NetworkingTestCase, unknown> = (_fork, testName) => {
  return {
    testFunction: (testcase) => {
      const networkingFn = networkingFns[testName];
      if (networkingFn === undefined) {
        throw Error(`No networkingFn for ${testName}`);
      }

      return networkingFn(testcase.data);
    },
    options: {
      inputTypes: {data: InputType.YAML},
      getExpected: (testCase) => testCase.data.result,
      // Do not manually skip tests here, do it in packages/beacon-node/test/spec/presets/index.test.ts
    },
  };
};

type NetworkingTestCase = {
  meta?: any;
  data: {
    result: number[];
  };
};

specTestIterator(path.join(ethereumConsensusSpecsTests.outputDir, "tests", ACTIVE_PRESET), {
  networking: {type: RunnerType.default, fn: networking},
});
