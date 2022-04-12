import {MatrixMarketplaceNFT} from "./model";
import {FlowEnv} from "./env";

import {checkNFTsCollection} from "../cadence/check_nfts_collection";
import {getNFTsScript} from "../cadence/get_nfts";
import {initNFTCollection} from "../cadence/init_nfts_collection";
import {getFLOWBalanceScript} from "../cadence/get_flow_balance";
import {getFUSDBalanceScript} from "../cadence/get_fusd_balance";
import {mintNFTs} from "../cadence/mint_nfts";
import {NFTClient} from "./NFTClient";
import fcl from "@onflow/fcl";
import t from "@onflow/types";

export class MatrixMarketplaceNFTClient implements NFTClient {
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
                    .put("0xNFT_ADDRESS", "0xf8d6e0586b0a20c7")
                    .put("0xNON_FUNGIBLE_TOKEN_ADDRESS", "0xf8d6e0586b0a20c7");
        }
    }

    public async mintNFTs(recipientBatch: [string], subCollectionIdBatch: [string], metadataBatch: [{string :string}]): Promise<boolean> {
        try {
            const response = await fcl.send([
                mintNFTs,
                fcl.args([fcl.arg(recipientBatch, [t.Address]), fcl.arg(subCollectionIdBatch, [t.String]), fcl.arg(metadataBatch)]),
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

    public async getNFTs(account: string): Promise<MatrixMarketplaceNFT[]> {
        try {
            const response = await fcl.send([getNFTsScript, fcl.args([fcl.arg(account, t.Address)]), fcl.limit(2000)]);
            console.log(response);
            return fcl.decode(response);
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
