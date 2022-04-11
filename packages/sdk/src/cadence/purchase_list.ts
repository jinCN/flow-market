import * as fcl from "@onflow/fcl";

export const purchaseListingScript: string = fcl.transaction`
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import NFTStorefront from 0xNFT_STOREFRONT
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketplaceNFT from 0xNFT_ADDRESS

transaction(listingResourceId: UInt64, storefrontAddress: Address) {
    
    let paymentVault: @FungibleToken.Vault
    let matrixMarketplaceNFTCollection: &MatrixMarketplaceNFT.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(signer: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)   //testnet 0xa2811f685dccc3ec
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceId)
                  ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainFlowVault = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from signer storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        self.matrixMarketplaceNFTCollection = signer.borrow<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Receiver}>(
            from: MatrixMarketplaceNFT.CollectionStoragePath) ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault
        )
        
        self.matrixMarketplaceNFTCollection.deposit(token: <-item)
        
        self.storefront.cleanup(listingResourceID: listingResourceId)
        log("transaction done")
    }
}`;
