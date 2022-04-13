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