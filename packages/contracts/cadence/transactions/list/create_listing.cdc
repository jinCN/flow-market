import NFTStorefront from "../../contracts/lib/NFTStorefront.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketPlaceNFT from "../../contracts/MatrixMarketPlaceNFT.cdc"
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {

    let storefront: &NFTStorefront.Storefront

    let exampleNFTProvider: Capability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>

    let tokenReceiver: Capability<&FungibleToken.Vault{FungibleToken.Receiver}>

    prepare(acct: AuthAccount) {

        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) ?? panic("can't borrow storefront")

        if acct.getCapability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath).check() == false {
            acct.link<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath, target: MatrixMarketPlaceNFT.collectionStoragePath)
        }

        self.exampleNFTProvider = acct.getCapability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath)!
        assert(self.exampleNFTProvider.borrow() != nil, message: "Missing or mis-typed MatrixMarketPlaceNFT.Collection provider")


        self.tokenReceiver = acct.getCapability<&FungibleToken.Vault{FungibleToken.Receiver}>(/public/MainReceiver)!
        assert(self.tokenReceiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

        let saleCut = NFTStorefront.SaleCut(
            receiver: self.tokenReceiver,
            amount: 10.0
        )

        self.storefront.createListing(
            nftProviderCapability: self.exampleNFTProvider,
            nftType: Type<@NonFungibleToken.NFT>(),
            nftID: 0,
            salePaymentVaultType: Type<@FungibleToken.Vault>(),
            saleCuts: [saleCut]
            )

        log("storefront listing created")
    }
}
