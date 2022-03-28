import NFTStorefront from "../../contracts/lib/NFTStorefront.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketPlaceNFT from "../../contracts/MatrixMarketPlaceNFT.cdc"
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"

transaction {
    let paymentVault: @FungibleToken.Vault
    let exampleNFTCollection: &MatrixMarketPlaceNFT.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(0x04)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: 10)
                  ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/MainVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        self.exampleNFTCollection = acct.borrow<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Receiver}>(
            from: MatrixMarketPlaceNFT.collectionStoragePath) ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
     let item <- self.listing.purchase(
     payment: <-self.paymentVault
     )

       self.exampleNFTCollection.deposit(token: <-item)

        /* //-
        error: Execution failed:
        computation limited exceeded: 100
        */
        // Be kind and recycle
        self.storefront.cleanup(listingResourceID: 10)
        log("transaction done")
    }

    //- Post to check item is in collection?
}
