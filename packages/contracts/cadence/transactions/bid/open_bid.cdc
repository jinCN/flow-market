import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketOpenBid from "../../contracts/MatrixMarketOpenBid.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"
import MatrixMarket from "../../contracts/MatrixMarket.cdc"

transaction(nftId: UInt64, amount: UFix64, royaltyReceivers: [Address], royaltyAmount: [UFix64]) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>
    let openBid: &MatrixMarketOpenBid.OpenBid

    prepare(acct: AuthAccount) {
        let vaultRefPrivatePath = /private/FlowTokenVaultRefForMatrixMarketOpenBid

        self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarket.CollectionPublicPath)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed MatrixMarket receiver")

        if !acct.getCapability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath)!.check() {
            acct.link<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath, target: /storage/flowTokenVault)
        }

        self.vaultRef = acct.getCapability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openBid = acct.borrow<&MatrixMarketOpenBid.OpenBid>(from: MatrixMarketOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketOpenBid OpenBid")
    }

    execute {
        var size = royaltyReceivers.length
        if (size != royaltyAmount.length) {
            panic ("royaityReceivers, royaityaMount length not equal")
        }
        let saleCut = MatrixMarketOpenBid.Cut(
                    receiver: getAccount(royaltyReceivers[0]).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!,
                    amount: royaltyAmount[0]
                )
        let saleCuts = [saleCut]
        while size > 1 {
            saleCuts.append(MatrixMarketOpenBid.Cut(
                receiver: getAccount(royaltyReceivers[size-1]).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!,
                amount:  royaltyAmount[size-1]
            ))
            size = size - 1
        }

        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@MatrixMarket.NFT>(),
            nftId: nftId,
            cuts: saleCuts
        )
    }
}
