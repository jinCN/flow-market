import * as fcl from "@onflow/fcl";

export const removeListingScript: string = fcl.transaction`
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS
transaction(amount: UFix64, recipient: Address) {
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontManager}

    prepare(signer: AuthAccount) {
        self.storefront = signer.borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontManager}>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
        log("listing removed")
    }
}`;
