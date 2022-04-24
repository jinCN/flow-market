import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketplaceOpenBid from "../../contracts/MatrixMarketplaceOpenBid.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"
import MatrixMarketplaceNFT from "../../contracts/MatrixMarketplaceNFT.cdc"

transaction(nftId: UInt64, amount: UFix64) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>
    let openBid: &MatrixMarketplaceOpenBid.OpenBid

    prepare(acct: AuthAccount) {
        let vaultRefPrivatePath = /private/FlowTokenVaultRefForMatrixMarketplaceOpenBid

        self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed ExampleNFT receiver")

        if !acct.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!.check() {
            acct.link<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath, target: /storage/flowTokenVault)
        }

        self.vaultRef = acct.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openBid = acct.borrow<&MatrixMarketplaceOpenBid.OpenBid>(from: MatrixMarketplaceOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketplaceOpenBid OpenBid")
    }

    execute {
        let cut = MatrixMarketplaceOpenBid.Cut(
            receiver: getAccount(0x00).getCapability<&{FungibleToken.Receiver}>(/public/NFTCollection),
            amount: amount
        )
        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@MatrixMarketplaceNFT.NFT>(),
            nftId: nftId,
            cuts: []
        )
    }
}
