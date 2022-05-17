/**
## Use Contract account to link minter resource to a public path
for performing as a factory
*/

import MatrixMarket from "../contracts/MatrixMarket.cdc"

transaction() {
    prepare(signer: AuthAccount) {
        if (signer.getCapability(MatrixMarket.MinterPublicPath).borrow<&MatrixMarket.NFTMinter>() == nil) {
            signer.link<&MatrixMarket.NFTMinter>(MatrixMarket.MinterPublicPath, target: MatrixMarket.MinterStoragePath)
        }
    }
}
