import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketPlaceOpenBid from "../../contracts/MatrixMarketPlaceOpenBid.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"
import MatrixMarketPlaceNFT from "../../contracts/MatrixMarketPlaceNFT.cdc"

transaction(nftId: UInt64, amount: UFix64) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>
    let openBid: &MatrixMarketPlaceOpenBid.OpenBid

    prepare(account: AuthAccount) {
        let vaultRefPrivatePath = /private/FlowTokenVaultRefForMatrixMarketPlaceOpenBid

        self.nftReceiver = account.getCapability<&{NonFungibleToken.CollectionPublic}>(/public/NFTCollection)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed ExampleNFT receiver")

        if !account.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!.check() {
            account.link<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath, target: /storage/flowTokenVault)
        }

        self.vaultRef = account.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openBid = account.borrow<&MatrixMarketPlaceOpenBid.OpenBid>(from: MatrixMarketPlaceOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketPlaceOpenBid OpenBid")
    }

    execute {
        let cut = MatrixMarketPlaceOpenBid.Cut(
            receiver: getAccount(0x00).getCapability<&{FungibleToken.Receiver}>(/public/NFTCollection),
            amount: amount
        )
        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@MatrixMarketPlaceNFT.NFT>(),
            nftId: nftId,
            cuts: []
        )
    }
}
