import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const rpcUrl = getFullnodeUrl("mainnet");

export const suiClient = new SuiClient({ url: rpcUrl });
