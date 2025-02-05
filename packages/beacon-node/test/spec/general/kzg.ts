import {expect} from "vitest";
import * as ckzg from "c-kzg";
import {fromHexString, toHexString} from "@chainsafe/ssz";
import {InputType} from "@lodestar/spec-test-util";
import {TestRunnerFn} from "../utils/types.js";

const testFnByType: Record<string, (input: any, output?: any) => any> = {
  blob_to_kzg_commitment: blobToKzgCommitment,
  compute_blob_kzg_proof: computeBlobKzgProof,
  compute_kzg_proof: computeKzgProof,
  verify_blob_kzg_proof: verifyBlobKzgProof,
  verify_blob_kzg_proof_batch: verifyBlobKzgProofBatch,
  verify_kzg_proof: verifyKzgProof,
  compute_cells_and_kzg_proofs: computeCellsAndKzgProofs,
  recover_cells_and_kzg_proofs: recoverCellsAndKzgProofs,
  verify_cell_kzg_proof_batch: verifyCellKzgProofBatch,
};

export const kzgTestRunner: TestRunnerFn<KzgTestCase, unknown> = (_fork, testName) => {
  return {
    testFunction: ({data}) => {
      const testFn = testFnByType[testName];
      if (testFn === undefined) {
        throw Error(`Unknown kzg test ${testName}`);
      }

      try {
        return testFn(data.input, data.output) as unknown;
      } catch (e) {
        // const {message} = e as Error;
        // if (message.includes("BLST_ERROR") || message === "EMPTY_AGGREGATE_ARRAY" || message === "ZERO_SECRET_KEY") {
        //   return null;
        // }

        // biome-ignore lint/complexity/noUselessCatch: <explanation>
        throw e;
      }
    },
    options: {
      inputTypes: {data: InputType.YAML},
      getExpected: (testCase) => {
        // this have more complex expectations and need to be checked manually
        if (testName === "compute_cells_and_kzg_proofs" || testName === "recover_cells_and_kzg_proofs") {
          return;
        }
        return testCase.data.output;
      },
      // Do not manually skip tests here, do it in packages/beacon-node/test/spec/general/index.test.ts
    },
  };
};

type KzgTestCase = {
  meta?: any;
  data: {
    input: unknown;
    output: unknown;
  };
};

type BlobToKzgCommitmentInput = {
  blob: string;
};
function blobToKzgCommitment(input: BlobToKzgCommitmentInput): string | null {
  const blob = fromHexString(input.blob);
  try {
    return toHexString(ckzg.blobToKzgCommitment(blob));
  } catch (_e) {
    return null;
  }
}

type ComputeKzgProofInput = {
  blob: string;
  z: string;
};
function computeKzgProof(input: ComputeKzgProofInput): string[] | null {
  const blob = fromHexString(input.blob);
  const z = fromHexString(input.z);
  try {
    return toHexString(ckzg.computeKzgProof(blob, z));
  } catch (_e) {
    return null;
  }
}

type ComputeBlobKzgProofInput = {
  blob: string;
  commitment: string;
};
function computeBlobKzgProof(input: ComputeBlobKzgProofInput): string | null {
  const blob = fromHexString(input.blob);
  const commitment = fromHexString(input.commitment);
  try {
    return toHexString(ckzg.computeBlobKzgProof(blob, commitment));
  } catch (_e) {
    return null;
  }
}

type VerifyKzgProofInput = {
  commitment: string;
  y: string;
  z: string;
  proof: string;
};
function verifyKzgProof(input: VerifyKzgProofInput): boolean | null {
  const commitment = fromHexString(input.commitment);
  const z = fromHexString(input.z);
  const y = fromHexString(input.y);
  const proof = fromHexString(input.proof);

  try {
    return ckzg.verifyKzgProof(commitment, z, y, proof);
  } catch (_e) {
    return null;
  }
}

type VerifyBlobKzgProofInput = {
  blob: string;
  commitment: string;
  proof: string;
};
function verifyBlobKzgProof(input: VerifyBlobKzgProofInput): boolean | null {
  const blob = fromHexString(input.blob);
  const commitment = fromHexString(input.commitment);
  const proof = fromHexString(input.proof);

  try {
    return ckzg.verifyBlobKzgProof(blob, commitment, proof);
  } catch {
    return null;
  }
}

type VerifyBlobKzgProofBatchInput = {
  blobs: string[];
  commitments: string[];
  proofs: string[];
};
function verifyBlobKzgProofBatch(input: VerifyBlobKzgProofBatchInput): boolean | null {
  const blobs = input.blobs.map(fromHexString);
  const commitments = input.commitments.map(fromHexString);
  const proofs = input.proofs.map(fromHexString);

  try {
    return ckzg.verifyBlobKzgProofBatch(blobs, commitments, proofs);
  } catch {
    return null;
  }
}

type ComputeCellsAndKzgProofsInput = {
  blob: string;
};
function computeCellsAndKzgProofs(input: ComputeCellsAndKzgProofsInput, output: string[][]): void {
  const blob = fromHexString(input.blob);

  let cells: ckzg.Cell[];
  let proofs: ckzg.KZGProof[];
  try {
    [cells, proofs] = ckzg.computeCellsAndKzgProofs(blob);
  } catch {
    expect(output).toBeNull();
    return;
  }

  expect(output).not.toBeNull();
  expect(output.length).toBe(2);
  const expectedCells = output[0];
  const expectedProofs = output[1];
  expect(cells.length).toBe(expectedCells.length);
  for (let i = 0; i < cells.length; i++) {
    expect(toHexString(cells[i])).toEqual(expectedCells[i]);
  }
  expect(proofs.length).toBe(expectedProofs.length);
  for (let i = 0; i < proofs.length; i++) {
    expect(toHexString(proofs[i])).toEqual(expectedProofs[i]);
  }
}

type RecoverCellsAndKzgProofsInput = {
  cell_indices: number[];
  cells: string[];
};
function recoverCellsAndKzgProofs(input: RecoverCellsAndKzgProofsInput, output: string[][]): void {
  let recoveredCells: ckzg.Cell[];
  let recoveredProofs: ckzg.KZGProof[];
  const cellIndices = input.cell_indices;
  const cells = input.cells.map(fromHexString);

  try {
    [recoveredCells, recoveredProofs] = ckzg.recoverCellsAndKzgProofs(cellIndices, cells);
  } catch {
    expect(output).toBeNull();
    return;
  }

  expect(output).not.toBeNull();
  expect(output.length).toBe(2);
  const expectedCells = output[0];
  const expectedProofs = output[1];
  expect(recoveredCells.length).toBe(expectedCells.length);
  for (let i = 0; i < recoveredCells.length; i++) {
    expect(toHexString(recoveredCells[i])).toEqual(expectedCells[i]);
  }
  expect(recoveredProofs.length).toBe(expectedProofs.length);
  for (let i = 0; i < recoveredProofs.length; i++) {
    expect(toHexString(recoveredProofs[i])).toEqual(expectedProofs[i]);
  }
}

type VerifyCellKzgProofBatchInput = {
  commitments: string[];
  cell_indices: number[];
  cells: string[];
  proofs: string[];
};
function verifyCellKzgProofBatch(input: VerifyCellKzgProofBatchInput): boolean | null {
  const commitments = input.commitments.map(fromHexString);
  const cellIndices = input.cell_indices;
  const cells = input.cells.map(fromHexString);
  const proofs = input.proofs.map(fromHexString);

  try {
    return verifyCellKzgProofBatch(commitments, cellIndices, cells, proofs);
  } catch {
    return null;
  }
}
