import {FlowEnv} from "../env";

export interface IBindConfigs {
    fungibleTokenAddress?:string;
    fusdAddress?:string;
    flowTokenAddress?:string;
    nftStorefront?:string;
    nonFungibleTokenAddress?:string;
}
export interface OpenBidClient {
    bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void>;
    setupFcl(key: string, value: string): Promise<void>
    
    acceptBid(supportedNFTName: string, supportedNFTAddress: string, bidResourceId: number, openBidAddress: string): Promise<number>;
    initOpenBid(): Promise<number>;
    openBid(supportedNFTName:string, supportedNFTAddress:string,nftId: number, amount: string, paymentToken: string, royaltyReceivers: string[], royaltyAmount: string[], expirationTime: string): Promise<boolean>;
    removeBid(bidResourceId: number): Promise<string>;
    getBidIds(account: string): Promise<number[]>;
    getBidDetails(account: string, bidResourceId: number): Promise<string>;
}
