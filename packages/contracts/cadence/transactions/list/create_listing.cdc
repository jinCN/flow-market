import NFTStorefront from "../../contracts/lib/NFTStorefront.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketPlaceNFT from "../../contracts/MatrixMarketPlaceNFT.cdc"
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction(nftId: UInt64, price: UFix64) {
           
    let storefront: &NFTStorefront.Storefront

    let matrixMarketPlaceNFTProvider: Capability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>

    let tokenReceiver: Capability<&{FungibleToken.Receiver}>

    prepare(acct: AuthAccount) {

        // borrow Storefront resource
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) ?? panic("can't borrow storefront")

        // to access MatrixMarketPlaceNFT
        if acct.getCapability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath).check() == false {
            acct.link<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath, target: MatrixMarketPlaceNFT.collectionStoragePath)
        }

        self.matrixMarketPlaceNFTProvider = acct.getCapability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath)!
        assert(self.matrixMarketPlaceNFTProvider.borrow() != nil, message: "Missing or mis-typed MatrixMarketPlaceNFT.Collection provider")

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
