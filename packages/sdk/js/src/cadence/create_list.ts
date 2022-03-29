import * as fcl from "@onflow/fcl";

export const createListingScript: string = fcl.transaction`
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS
transaction(nftId: UInt64, price: UFix64) {
    
    let storefront: &NFTStorefront.Storefront

    let matrixMarketPlaceNFTProvider: Capability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>

    let tokenReceiver: Capability<&FungibleToken.Vault{FungibleToken.Receiver}>

    prepare(signer: AuthAccount) {

        self.storefront = signer.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) ?? panic("can't borrow storefront")

        if signer.getCapability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath).check() == false {
            signer.link<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath, target: MatrixMarketPlaceNFT.collectionStoragePath)
        }

        self.matrixMarketPlaceNFTProvider = signer.getCapability<&MatrixMarketPlaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPrivatePath)!
        assert(self.matrixMarketPlaceNFTProvider.borrow() != nil, message: "Missing or mis-typed MatrixMarketPlaceNFT.Collection provider")


        self.tokenReceiver = signer.getCapability<&FungibleToken.Vault{FungibleToken.Receiver}>(/public/MainReceiver)!
        assert(self.tokenReceiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

        let saleCut = NFTStorefront.SaleCut(
            receiver: self.tokenReceiver,
            amount: price
        )

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
