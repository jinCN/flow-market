import * as fcl from "@onflow/fcl";

export const removeListingScript: string = fcl.transaction`
import NFTStorefront from 0xNFT_STOREFRONT

transaction(listingResourceID: UInt64) {
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
