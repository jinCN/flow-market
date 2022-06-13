import {checkOpenOffer} from '../cadence/openoffer/check_openoffer';
import {FlowService} from './flow';
import {MatrixMarket} from "./model";
import {FlowEnv} from "./env";

import {acceptOffer} from "../cadence/openoffer/accept_offer";
import {initOpenOffer} from "../cadence/openoffer/init_openoffer";
import {openOffer} from "../cadence/openoffer/open_offer";
import {getOfferDetails} from "../cadence/openoffer/read_offer_details";
import {getOfferIds} from "../cadence/openoffer/read_openoffer_ids";
import {removeOpenOffer} from "../cadence/openoffer/remove_offer";
import {IBindConfigs, OpenOfferClient} from "./interfaces/OpenOfferClient";
import * as t from "@onflow/types";

export class MatrixMarketOpenOfferClient implements OpenOfferClient {

    private fcl: any;

    private env: FlowEnv | undefined;
    
    private authMethod?: (account?: any) => Promise<any>
    
    public async bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void> {
        this.env = env;
        this.fcl = fcl;
        switch (env) {
            case FlowEnv.flowTestnet: {
                await this.fcl
                    .config()
                    .put("accessNode.api", "https://rest-testnet.onflow.org") // connect to Flow testnet
                    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn") // use Blocto testnet wallet
                    .put("0xFUNGIBLE_TOKEN_ADDRESS", "0x9a0766d93b6608b7")
                    .put("0xFUSD_ADDRESS", "0xe223d8a629e49c68")
                    .put("0xFLOW_TOKEN_ADDRESS", "0x7e60df042a9c0868")
                    .put("0xNFT_ADDRESS", "0x7f3812b53dd4de20")
                    .put("0xOPENBID_ADDRESS", "0x7f3812b53dd4de20")
                    .put("0xNON_FUNGIBLE_TOKEN_ADDRESS", "0x631e88ae7f1d7c20");
                break;
            }
            case FlowEnv.flowMainnet: {
                await this.fcl
                    .config()
                    .put("accessNode.api", "https://rest-mainnet.onflow.org")
                    .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn") // use Blocto wallet
                    .put("0xFUNGIBLE_TOKEN_ADDRESS", "0xf233dcee88fe0abe")
                    .put("0xFUSD_ADDRESS", "0x3c5959b568896393")
                    .put("0xFLOW_TOKEN_ADDRESS", "0x1654653399040a61")
                    .put("0xNFT_ADDRESS", "")
                    .put("0xOPENBID_ADDRESS", "0x7f3812b53dd4de20")
                    .put("0xNON_FUNGIBLE_TOKEN_ADDRESS", "0x1d7e57aa55817448");
                break;
            }
            case FlowEnv.localEmulator:
            default:
                await this.fcl
                    .config()
                    .put("accessNode.api", "http://localhost:8080")
                    .put("discovery.wallet", "http://localhost:8701/fcl/authn")
                    .put("0xFUNGIBLE_TOKEN_ADDRESS", "0xee82856bf20e2aa6")
                    .put("0xFUSD_ADDRESS", "0xf8d6e0586b0a20c7")
                    .put("0xFLOW_TOKEN_ADDRESS", "0x0ae53cb6e3f42a79")
                    .put("0xNFT_ADDRESS", "0xf8d6e0586b0a20c7")
                    .put("0xOPENBID_ADDRESS", "0xf8d6e0586b0a20c7")
                    .put("0xNON_FUNGIBLE_TOKEN_ADDRESS", "0xf8d6e0586b0a20c7");
        }
    }

    /** Setup FCL instance
     *
     * @async
     * @param {key} - example:"0xNFT_ADDRESS"
     * @param {value} - example:"0x7f3812b53dd4de20"
     * @returns {Promise<void>}
     */
    public async setupFcl(key: string, value: string): Promise<void> {
        switch (this.env) {
            case FlowEnv.flowTestnet: {
                await this.fcl
                    .config()
                    .put(key, value);
                break;
            }
            case FlowEnv.flowTestnet: {
                await this.fcl
                    .config()
                    .put(key, value);
                break;
            }
            case FlowEnv.flowTestnet: {
                await this.fcl
                    .config()
                    .put(key, value);
                break;
            }
        }
    }
    
    public bindAuth(flowAddress: string, privateKeyHex: string, accountIndex: number = 0) {
        this.authMethod = new FlowService(flowAddress, privateKeyHex, accountIndex).authorize()
    }
    
    private getAuth() {
        return this.authMethod || this.fcl.currentUser().authorization
    }
    
    public async checkOpenOffer(address: string): Promise<boolean> {
        try {
            const response = await this.fcl.send([
                checkOpenOffer,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(2000)
            ]);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    public async acceptOffer(supportedNFTName: string, supportedNFTAddress: string, offerResourceId: number, openOfferAddress: string): Promise<string> {
        try {
            const response = await this.fcl.send([
                this.fcl.transaction(acceptOffer.replace(/0xsupportedNFTName/g, supportedNFTName).replace(/0xsupportedNFTAddress/g, supportedNFTAddress)),
                this.fcl.args([this.fcl.arg(offerResourceId, t.UInt64), this.fcl.arg(openOfferAddress, t.Address)]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
                this.fcl.payer(this.getAuth())
            ]);
            const ret = await this.fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async initOpenOffer(): Promise<string> {
        try {
            const response = await this.fcl.send([
                initOpenOffer,
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
                this.fcl.payer(this.getAuth())
            ]);
            const ret = await this.fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async openOffer(supportedNFTName:string, supportedNFTAddress:string,nftId: number, amount: string, paymentToken: string, royaltyReceivers: string[], royaltyAmount: string[], expirationTime: string): Promise<string> {
        try {
            const response = await this.fcl.send([
                this.fcl.transaction(openOffer.replace(/0xsupportedNFTName/g, supportedNFTName).replace(/0xsupportedNFTAddress/g, supportedNFTAddress)),
                this.fcl.args([
                  this.fcl.arg(nftId, t.UInt64),
                    this.fcl.arg(amount, t.UFix64),
                    this.fcl.arg(paymentToken, t.String),
                    this.fcl.arg(royaltyReceivers, t.Array(t.Address)),
                    this.fcl.arg(royaltyAmount, t.Array(t.UFix64)),
                    this.fcl.arg(expirationTime, t.UFix64),
                ]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
                this.fcl.payer(this.getAuth())
            ]);
            const ret = await this.fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async removeOffer(offerResourceId: number): Promise<string> {
        try {
            const response = await this.fcl.send([
                removeOpenOffer,
                this.fcl.args([this.fcl.arg(offerResourceId, t.UInt64)]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
                this.fcl.payer(this.getAuth())
            ]);
            const ret = await this.fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async getOfferIds(account: string): Promise<number[]> {
        try {
            const response = await this.fcl.send([getOfferIds, this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(2000)]);
            
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async getOfferDetails(account: string, offerResourceId: number): Promise<string> {
        try {
            const response = await this.fcl.send([getOfferDetails, this.fcl.args([this.fcl.arg(account, t.Address), this.fcl.arg(offerResourceId, t.UInt64)]), this.fcl.limit(2000)]);
            
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }


}
