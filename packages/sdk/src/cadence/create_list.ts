import * as fcl from "@onflow/fcl";

export const createListingScript: string = fcl.transaction`
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import NFTStorefront from 0xNFT_STOREFRONT
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketPlaceNFT from 0xNFT_ADDRESS

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
}`;
