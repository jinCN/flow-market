import {MatrixMarket} from "../model";
import {FlowEnv} from "../env";

export interface IBindConfigs {
    fungibleTokenAddress?:string;
    fusdAddress?:string;
    flowTokenAddress?:string;
    nftStorefront?:string;
    nonFungibleTokenAddress?:string;
}
export interface NFTClient {
    bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void>;
    setupFcl(key: string, value: string): Promise<void>
    bindAuth(flowAddress: string, privateKeyHex: string, accountIndex?: number): void
    FUSDBalance(address: string): Promise<number>;
    FLOWBalance(address: string): Promise<number>;
    checkNFTsCollection(address: string): Promise<boolean>;
    initNFTCollection(): Promise<string>;
    getNFTs(account: string): Promise<number[]>;
    mintNFTs(nftAdminAddress: string, recipientBatch: [string], subCollectionIdBatch: [string], metadataBatch: Array<Array<{ key: string, value: string }>>): Promise<string>;
}
