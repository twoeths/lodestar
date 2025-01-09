import {ContainerType, ListCompositeType, ValueOf} from "@chainsafe/ssz";
import {ChainConfig} from "@lodestar/config";
import {ForkName, isForkPostElectra} from "@lodestar/params";
import {ssz} from "@lodestar/types";

// Misc SSZ types used only in the beacon-node package, no need to upstream to types

export const signedBLSToExecutionChangeVersionedType = new ContainerType(
  {
    // Assumes less than 256 forks, sounds reasonable in our lifetime
    preCapella: ssz.Boolean,
    data: ssz.capella.SignedBLSToExecutionChange,
  },
  {jsonCase: "eth2", typeName: "SignedBLSToExecutionChangeVersionedType"}
);
export type SignedBLSToExecutionChangeVersioned = ValueOf<typeof signedBLSToExecutionChangeVersionedType>;

export const BlobSidecarsByRootRequestType = (fork: ForkName, config: ChainConfig) =>
  new ListCompositeType(
    ssz.deneb.BlobIdentifier,
    isForkPostElectra(fork) ? config.MAX_REQUEST_BLOB_SIDECARS_ELECTRA : config.MAX_REQUEST_BLOB_SIDECARS
  );
export type BlobSidecarsByRootRequest = ValueOf<ReturnType<typeof BlobSidecarsByRootRequestType>>;
