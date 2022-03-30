### Install

`yarn add @white-matrix/matrix-flow-market-sdk`

### API reference

core apis [VoucherClient](src/client/StorefrontClient.ts)
You can also check [Demo-front-page]('../demo-js-front/src/App.tsx') for reference

```typescript
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