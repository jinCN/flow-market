import {FlowEnv} from "../env";

export interface IBindConfigs {
    fungibleTokenAddress?:string;
    fusdAddress?:string;
    flowTokenAddress?:string;
    nftStorefront?:string;
    nonFungibleTokenAddress?:string;
}
export interface OpenOfferClient {
    bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void>;
    setupFcl(key: string, value: string): Promise<void>
    bindAuth(flowAddress: string, privateKeyHex: string, accountIndex?: number):void
    checkOpenOffer(address: string): Promise<boolean>
    acceptOffer(supportedNFTName: string, supportedNFTAddress: string, offerResourceId: number, openOfferAddress: string): Promise<string>;
    initOpenOffer(): Promise<string>;
    openOffer(supportedNFTName:string, supportedNFTAddress:string,nftId: number, amount: string, paymentToken: string, royaltyReceivers: string[], royaltyAmount: string[], expirationTime: string): Promise<string>;
    removeOffer(offerResourceId: number): Promise<string>;
    getOfferIds(account: string): Promise<number[]>;
    getOfferDetails(account: string, offerResourceId: number): Promise<string>;
}
