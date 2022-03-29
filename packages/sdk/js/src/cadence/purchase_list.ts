import * as fcl from "@onflow/fcl";

export const purchaseListingScript: string = fcl.transaction`
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS
transaction(listingResourceId: UInt64, adminAddress: Address) {
    
    let paymentVault: @FungibleToken.Vault
    let matrixMarketPlaceNFTCollection: &MatrixMarketPlaceNFT.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(signer: AuthAccount) {
        self.storefront = getAccount(adminAddress)   //testnet 0xa2811f685dccc3ec
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceId)
                  ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainFlowVault = signer.borrow<&FungibleToken.Vault>(from: /storage/MainVault)
            ?? panic("Cannot borrow FlowToken vault from signer storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        self.matrixMarketPlaceNFTCollection = signer.borrow<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Receiver}>(
            from: MatrixMarketPlaceNFT.collectionStoragePath) ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault
        )
        
        self.matrixMarketPlaceNFTCollection.deposit(token: <-item)
        
        self.storefront.cleanup(listingResourceID: listingResourceId)
        log("transaction done")
    }
}`;
