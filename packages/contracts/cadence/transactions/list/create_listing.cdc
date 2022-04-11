import NFTStorefront from "../../contracts/lib/NFTStorefront.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketplaceNFT from "../../contracts/MatrixMarketplaceNFT.cdc"
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction(nftId: UInt64, price: UFix64) {
           
    let storefront: &NFTStorefront.Storefront

    let matrixMarketPlaceNFTProvider: Capability<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>

    let tokenReceiver: Capability<&{FungibleToken.Receiver}>

    prepare(acct: AuthAccount) {

        // borrow Storefront resource
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) ?? panic("can't borrow storefront")

        // to access MatrixMarketplaceNFT
        if acct.getCapability<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath).check() == false {
            acct.link<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath, target: MatrixMarketplaceNFT.CollectionStoragePath)
        }

        self.matrixMarketPlaceNFTProvider = acct.getCapability<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath)
        assert(self.matrixMarketPlaceNFTProvider.borrow() != nil, message: "Missing or mis-typed MatrixMarketplaceNFT.Collection provider")

        // receiver flowtoken after NFT sold
        self.tokenReceiver = acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        assert(self.tokenReceiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

        // payment splitter
        let saleCut = NFTStorefront.SaleCut(
            receiver: self.tokenReceiver,
            amount: price
        )

        // on sale
        self.storefront.createListing(
            nftProviderCapability: self.matrixMarketPlaceNFTProvider,
            nftType: Type<@NonFungibleToken.NFT>(),
            nftID: nftId,
            salePaymentVaultType: Type<@FungibleToken.Vault>(),
            saleCuts: [saleCut]
            )

        log("storefront listing created")
    }
}
