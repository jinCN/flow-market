import {MatrixMarket} from "./model";
import {FlowEnv} from "./env";

import {acceptBid} from "../cadence/openbid/accept_bid";
import {initOpenBid} from "../cadence/openbid/init_openbid";
import {openBid} from "../cadence/openbid/open_bid";
import {getBidDetails} from "../cadence/openbid/read_bid_details";
import {getBidIds} from "../cadence/openbid/read_openbid_ids";
import {removeOpenBid} from "../cadence/openbid/remove_bid";
import {IBindConfigs, OpenBidClient} from "./interfaces/OpenBidClient";
import * as t from "@onflow/types";

export class MatrixMarketOpenBidClient implements OpenBidClient {

    private fcl: any;

    private env: FlowEnv | undefined;

    public async bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void> {
        this.env = env;
        this.fcl = fcl;
        switch (env) {
            case FlowEnv.flowTestnet: {
                await this.fcl
                    .config()
                    .put("accessNode.api", "https://access-testnet.onflow.org") // connect to Flow testnet
                    .put("challenge.handshake", "https://flow-wallet-testnet.blocto.app/authn") // use Blocto testnet wallet
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
                    .put("accessNode.api", "https://flow-access-mainnet.portto.io")
                    .put("challenge.handshake", "https://flow-wallet.blocto.app/authn") // use Blocto wallet
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

    public async acceptBid(bidResourceId: number, openBidAddress: string): Promise<number> {
        try {
            const response = await this.fcl.send([
                acceptBid,
                this.fcl.args([this.fcl.arg(bidResourceId, t.UInt64), this.fcl.arg(openBidAddress, t.Address)]),
                this.fcl.proposer(this.fcl.currentUser().authorization),
                this.fcl.authorizations([this.fcl.currentUser().authorization]),
                this.fcl.limit(2000),
                this.fcl.payer(this.fcl.currentUser().authorization)
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

    public async initOpenBid(): Promise<number> {
        try {
            const response = await this.fcl.send([
                initOpenBid,
                this.fcl.proposer(this.fcl.currentUser().authorization),
                this.fcl.authorizations([this.fcl.currentUser().authorization]),
                this.fcl.limit(2000),
                this.fcl.payer(this.fcl.currentUser().authorization)
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

    public async openBid(nftId: number, amount: string): Promise<boolean> {
        try {
            const response = await this.fcl.send([
                openBid,
                this.fcl.args([this.fcl.arg(nftId, t.UInt64), this.fcl.arg(amount, t.UFix64)]),
                this.fcl.proposer(this.fcl.currentUser().authorization),
                this.fcl.authorizations([this.fcl.currentUser().authorization]),
                this.fcl.limit(2000),
                this.fcl.payer(this.fcl.currentUser().authorization)
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

    public async removeBid(bidResourceId: number): Promise<string> {
        try {
            const response = await this.fcl.send([
                removeOpenBid,
                this.fcl.args([this.fcl.arg(bidResourceId, t.UInt64)]),
                this.fcl.proposer(this.fcl.currentUser().authorization),
                this.fcl.authorizations([this.fcl.currentUser().authorization]),
                this.fcl.limit(2000),
                this.fcl.payer(this.fcl.currentUser().authorization)
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

    public async getBidIds(account: string): Promise<number[]> {
        try {
            const response = await this.fcl.send([getBidIds, this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(2000)]);
            console.log(response);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async getBidDetails(account: string, bidResourceId: number): Promise<string> {
        try {
            const response = await this.fcl.send([getBidDetails, this.fcl.args([this.fcl.arg(account, t.Address), this.fcl.arg(bidResourceId, t.UInt64)]), this.fcl.limit(2000)]);
            console.log(response);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }


}
