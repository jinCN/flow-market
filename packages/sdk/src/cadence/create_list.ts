import * as fcl from "@onflow/fcl";

export const createListingScript: string = fcl.transaction`
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import NFTStorefront from 0xNFT_STOREFRONT
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketplaceNFT from 0xNFT_ADDRESS

transaction(nftId: UInt64, price: UFix64) {
    
    let storefront: &NFTStorefront.Storefront

    let matrixMarketPlaceNFTProvider: Capability<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>

    let tokenReceiver: Capability<&{FungibleToken.Receiver}>

    prepare(acct: AuthAccount) {

        // borrow Storefront resource
        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            acct.save<@NFTStorefront.Storefront>(<- NFTStorefront.createStorefront() , to: NFTStorefront.StorefrontStoragePath)
        }
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) ?? panic("can't borrow storefront")

        // to access MatrixMarketplaceNFT
        if acct.getCapability<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath).check() == false {
            acct.link<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath, target: MatrixMarketplaceNFT.CollectionStoragePath)
        }

        self.matrixMarketPlaceNFTProvider = acct.getCapability<&MatrixMarketplaceNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath)!
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
}`;
