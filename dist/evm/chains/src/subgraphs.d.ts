type SubgraphParams = {
  noderealApiKey?: string;
};
export declare const V3_SUBGRAPHS: {
  readonly 943: "https://api.studio.thegraph.com/query/50593/integral-v12/v1.0.0";
};
export declare const V2_SUBGRAPHS: {};
export declare const BLOCKS_SUBGRAPHS: {
  readonly 943: "https://api.studio.thegraph.com/query/50593/base-testnet-blocks/version/latest";
};
export declare const STABLESWAP_SUBGRAPHS: {};
export declare function getV3Subgraphs({ noderealApiKey }: SubgraphParams): {
  readonly 943: "https://api.studio.thegraph.com/query/50593/integral-v12/v1.0.0";
};
export declare function getV2Subgraphs({ noderealApiKey }: SubgraphParams): {};
export declare function getBlocksSubgraphs({
  noderealApiKey,
}: SubgraphParams): {
  readonly 943: "https://api.studio.thegraph.com/query/50593/base-testnet-blocks/version/latest";
};
export {};
//# sourceMappingURL=subgraphs.d.ts.map
