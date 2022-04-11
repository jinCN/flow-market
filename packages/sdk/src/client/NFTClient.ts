import {MatrixMarketPlaceNFT} from "./model";
import {FlowEnv} from "./env";


export interface NFTClient {
    setupGlobalFcl(env: FlowEnv): Promise<void>;
    transferFUSD(to: string, amount: string): Promise<string>;
    FUSDBalance(address: string): Promise<number>;
    transferFLOW(to: string, amount: string): Promise<string>;
    FLOWBalance(address: string): Promise<number>;
    checkNFTsCollection(address: string): Promise<boolean>;
    initNFTCollection(): Promise<string>;
    initStorefront(): Promise<string>;
    getNFTs(account: string): Promise<MatrixMarketPlaceNFT[]>;
    createList(nftId: number, price: string): Promise<string>;
    purchaseList(listingResourceId: number, adminAddress: string): Promise<string>;
    removeList(listingResourceID: number): Promise<string>;
    checkCapacity(
        address: string,
        currentBalance: number,
        paymentAmount: number,
        numberOfVouchers: number
    ): Promise<void>;
}
