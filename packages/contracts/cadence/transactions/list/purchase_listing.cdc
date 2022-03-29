import NFTStorefront from "../../contracts/lib/NFTStorefront.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketPlaceNFT from "../../contracts/MatrixMarketPlaceNFT.cdc"
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"

transaction(listingResourceId: UInt64, storefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let matrixMarketPlaceNFTCollection: &MatrixMarketPlaceNFT.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        // check and get list
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceId)
                  ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        // get flowtoken from buyer flowTokenVault
        let mainFlowVault = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        // to access MatrixMarketPlaceNFT
        self.matrixMarketPlaceNFTCollection = acct.borrow<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Receiver}>(
            from: MatrixMarketPlaceNFT.collectionStoragePath) ?? panic("Cannot borrow NFT collection receiver from account")
    }

    execute {
     let item <- self.listing.purchase(
     payment: <-self.paymentVault
     )
        // deposit nft to buyer collection
       self.matrixMarketPlaceNFTCollection.deposit(token: <-item)

        // cleanup list
        self.storefront.cleanup(listingResourceID: listingResourceId)
        log("transaction done")
    }

    //- Post to check item is in collection?
}
