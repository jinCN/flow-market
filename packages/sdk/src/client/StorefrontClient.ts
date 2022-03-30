import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {initStorefront} from "../cadence/init_storefront";
import {initNFTCollection} from "../cadence/init_nfts_collection";
import {getFLOWBalanceScript} from "../cadence/get_flow_balance";
import {getFUSDBalanceScript} from "../cadence/get_fusd_balance";
import {transferFLOWScript} from "../cadence/transfer_flow";
import {transferFUSDScript} from "../cadence/transfer_fusd";
import {getUsedStorageScript} from "../cadence/get_used_storage";
import {checkNFTsCollection} from "../cadence/check_nfts_collection";
import {getNFTsScript} from "../cadence/get_nfts";
import {createListingScript} from "../cadence/create_list";
import {purchaseListingScript} from "../cadence/purchase_list";
import {removeListingScript} from "../cadence/remove_list";
import {MatrixMarketPlaceNFT} from "./model";

export enum FlowEnv {
    localEmulator,
    flowTestnet,
    flowMainnet
}

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

export class StorefrontClient implements NFTClient {
    /** Setup global FCL instance
     *
     * @async
     * @param {FlowEnv} env - FlowEnv.{localEmulator, flowTestnet, flowMainnet}
     * @returns {Promise<void>}
     */
    public async setupGlobalFcl(env: FlowEnv): Promise<void> {
        switch (env) {
            case FlowEnv.flowTestnet: {
                await fcl
                    .config()
                    .put("accessNode.api", "https://access-testnet.onflow.org") // connect to Flow testnet
                    .put("challenge.handshake", "https://flow-wallet-testnet.blocto.app/authn") // use Blocto testnet wallet
                    .put("0xFUNGIBLE_TOKEN_ADDRESS", "0x9a0766d93b6608b7")
                    .put("0xFUSD_ADDRESS", "0xe223d8a629e49c68")
                    .put("0xFLOW_TOKEN_ADDRESS", "0x7e60df042a9c0868")
                    .put("0xNFT_STOREFRONT", "0x7f3812b53dd4de20")
                    .put("0xNFT_ADDRESS", "0x7f3812b53dd4de20")
                    .put("0xNON_FUNGIBLE_TOKEN_ADDRESS", "0x631e88ae7f1d7c20");
                break;
            }
            case FlowEnv.flowMainnet: {
                await fcl
                    .config()
                    .put("accessNode.api", "https://flow-access-mainnet.portto.io")
                    .put("challenge.handshake", "https://flow-wallet.blocto.app/authn") // use Blocto wallet
                    .put("0xFUNGIBLE_TOKEN_ADDRESS", "0xf233dcee88fe0abe")
                    .put("0xFUSD_ADDRESS", "0x3c5959b568896393")
                    .put("0xFLOW_TOKEN_ADDRESS", "0x1654653399040a61")
                    .put("0xNFT_STOREFRONT", "")
                    .put("0xNFT_ADDRESS", "")
                    .put("0xNON_FUNGIBLE_TOKEN_ADDRESS", "0x1d7e57aa55817448");
                break;
            }
            case FlowEnv.localEmulator:
            default:
                await fcl
                    .config()
                    .put("accessNode.api", "http://localhost:8080")
                    .put("discovery.wallet", "http://localhost:8701/fcl/authn")
                    .put("0xFUNGIBLE_TOKEN_ADDRESS", "0xee82856bf20e2aa6")
                    .put("0xFUSD_ADDRESS", "0xf8d6e0586b0a20c7")
                    .put("0xFLOW_TOKEN_ADDRESS", "0x0ae53cb6e3f42a79")
                    .put("0xNFT_STOREFRONT", "0xf8d6e0586b0a20c7")
                    .put("0xNFT_ADDRESS", "0xf8d6e0586b0a20c7")
                    .put("0xNON_FUNGIBLE_TOKEN_ADDRESS", "0xf8d6e0586b0a20c7");
        }
    }

    /**
     * Send transferFUSD transaction
     *
     * @async
     * @param {string} to - addresses of recipient
     * @param {string} amount - amount in string (1.0 means 1.0 FUSD)
     * @returns {Promise<string>} transactionId which can be used to verify the payment to server
     */
    public async transferFUSD(to: string, amount: string): Promise<string> {
        try {
            const response = await fcl.send([
                transferFUSDScript,
                fcl.args([fcl.arg(amount, t.UFix64), fcl.arg(to, t.Address)]),
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.limit(1000),
                fcl.payer(fcl.currentUser().authorization)
            ]);
            const ret = await fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    /**
     * Get FUSDBalance of an Account
     *
     * @async
     * @param {string} address - account address
     * @returns {Promise<number>} account balance (1.0 means 1.0 FUSD)
     */
    public async FUSDBalance(address: string): Promise<number> {
        try {
            const response = await fcl.send([
                getFUSDBalanceScript,
                fcl.args([fcl.arg(address, t.Address)]),
                fcl.limit(1000)
            ]);
            return fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject("Something is wrong with fetching FUSD balance");
        }
    }

    /**
     * Send transferFLOW transaction
     *
     * @async
     * @param {string} to - addresses of recipient
     * @param {string} amount - amount in string (1.0 means 1.0 FLOW)
     * @returns {Promise<string>} transactionId which can be used to verify the payment to server
     */
    public async transferFLOW(to: string, amount: string): Promise<string> {
        try {
            const response = await fcl.send([
                transferFLOWScript,
                fcl.args([fcl.arg(amount, t.UFix64), fcl.arg(to, t.Address)]),
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.limit(1000),
                fcl.payer(fcl.currentUser().authorization)
            ]);
            const ret = await fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    /**
     * Get FLOWBalance of an Account
     *
     * @async
     * @param {string} address - account address
     * @returns {Promise<number>} account balance (1.0 means 1.0 FLOW)
     */
    public async FLOWBalance(address: string): Promise<number> {
        try {
            const response = await fcl.send([
                getFLOWBalanceScript,
                fcl.args([fcl.arg(address, t.Address)]),
                fcl.limit(1000)
            ]);
            return fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject("Something is wrong with fetching FLOW balance");
        }
    }

    public async checkNFTsCollection(address: string): Promise<boolean> {
        try {
            const response = await fcl.send([
                checkNFTsCollection,
                fcl.args([fcl.arg(address, t.Address)]),
                fcl.limit(1000)
            ]);
            return fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    /**
     * Get all assets from given account
     *
     * @async
     * @param {string} recipient - recipient address
     * @returns {Promise<MatrixMarketPlaceNFT[]>} transaction id
     * @example ret = await client.getNFTs("0x01cf0e2f2f715450");
     */
    public async getNFTs(account: string): Promise<MatrixMarketPlaceNFT[]> {
        try {
            const response = await fcl.send([getNFTsScript, fcl.args([fcl.arg(account, t.Address)]), fcl.limit(2000)]);
            console.log(response);
            return fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    /**
     * Pre-check user storage capabilities
     *
     * @async
     * @param {string} address - userAddress
     * @param {number} currentBalance - userCurrentFlowBalance
     * @param {number} paymentAmount - amount Of Flow user to pay
     * @param {number} numberOfVouchers - number of vouchers user to mint
     * @returns {Promise<void>}
     */
    public async checkCapacity(
        address: string,
        currentBalance: number,
        paymentAmount: number,
        numberOfVouchers: number
    ): Promise<void> {
        try {
            const expectLeftBalance = currentBalance - paymentAmount;
            if (expectLeftBalance < 0.001) {
                return Promise.reject("Please may sure you have > 0.001 FLOW balance after payment");
            }
            console.log("expect balance", expectLeftBalance);

            const usedBytes = await fcl.decode(
                await fcl.send([getUsedStorageScript, fcl.args([fcl.arg(address, t.Address)]), fcl.limit(1000)])
            );

            console.log("used bytes", usedBytes);

            const thresholdInBytes = expectLeftBalance * 1e8 - usedBytes - numberOfVouchers * 500;

            console.log("thresholdInBytes", thresholdInBytes);

            if (thresholdInBytes < 100) {
                return Promise.reject(
                    "Please reserve more FLOW in your wallet, it seems like will run out of storage and likely cause a failed mint"
                );
            }
        } catch (error) {
            console.error(error);
            return Promise.reject("Something is wrong with checking Voucher Collection");
        }
    }

    public async createList(nftId: number, price: string): Promise<string> {
        try {
            const response = await fcl.send([
                createListingScript,
                fcl.args([fcl.arg(nftId, t.UInt64), fcl.arg(price, t.UFix64)]),
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.limit(1000),
                fcl.payer(fcl.currentUser().authorization)
            ]);
            const ret = await fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async purchaseList(listingResourceId: number, adminAddress: string): Promise<string> {
        try {
            const response = await fcl.send([
                purchaseListingScript,
                fcl.args([fcl.arg(listingResourceId, t.UInt64), fcl.arg(adminAddress, t.Address)]),
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.limit(1000),
                fcl.payer(fcl.currentUser().authorization)
            ]);
            const ret = await fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async removeList(listingResourceID: number): Promise<string> {
        try {
            const response = await fcl.send([
                removeListingScript,
                fcl.args([fcl.arg(listingResourceID, t.UInt64)]),
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.limit(1000),
                fcl.payer(fcl.currentUser().authorization)
            ]);
            const ret = await fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async initStorefront(): Promise<string> {
        try {
            const response = await fcl.send([
                initStorefront,
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.limit(1000),
                fcl.payer(fcl.currentUser().authorization)
            ]);
            const ret = await fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async initNFTCollection(): Promise<string> {
        try {
            const response = await fcl.send([
                initNFTCollection,
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.limit(1000),
                fcl.payer(fcl.currentUser().authorization)
            ]);
            const ret = await fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
}
