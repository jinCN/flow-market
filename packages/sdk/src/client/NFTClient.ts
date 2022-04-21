import {MatrixMarketplaceNFT} from "./model";
import {FlowEnv} from "./env";

export interface NFTClient {
    bindFcl(fcl: any): Promise<void>
    setupGlobalFcl(env: FlowEnv): Promise<void>;
    FUSDBalance(address: string): Promise<number>;
    FLOWBalance(address: string): Promise<number>;
    checkNFTsCollection(address: string): Promise<boolean>;
    initNFTCollection(): Promise<string>;
    getNFTs(account: string): Promise<number[]>;
    mintNFTs(nftAdminAddress: string, recipientBatch: [string], subCollectionIdBatch: [string], metadataBatch: Array<Array<{key:string, value:string}>>): Promise<string>;
}
