import * as fcl from "@onflow/fcl";

export const initStorefront: string = fcl.transaction`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import NFTStorefront from 0xNFT_STOREFRONT
transaction {
    prepare(signer: AuthAccount) {
        destroy signer.load<@NFTStorefront.Storefront> (from: NFTStorefront.StorefrontStoragePath)
        if signer.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            signer.save<@NFTStorefront.Storefront>(<- NFTStorefront.createStorefront() , to: NFTStorefront.StorefrontStoragePath)
        }
        signer.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)

    }
}`;
