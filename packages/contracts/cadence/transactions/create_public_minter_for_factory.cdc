/**
## Use Contract account to link minter resource to a public path
for performing as a factory
*/

import MatrixMarketplaceNFT from "../contracts/MatrixMarketplaceNFT.cdc"

transaction() {
    prepare(signer: AuthAccount) {
        if (signer.getCapability(MatrixMarketplaceNFT.MinterPublicPath).borrow<&MatrixMarketplaceNFT.NFTMinter>() == nil) {
            signer.link<&MatrixMarketplaceNFT.NFTMinter>(MatrixMarketplaceNFT.MinterPublicPath, target: MatrixMarketplaceNFT.MinterStoragePath)
        }
    }
}