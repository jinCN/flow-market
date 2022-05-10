import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketplaceOpenBid from "../../contracts/MatrixMarketplaceOpenBid.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"
import MatrixMarketplaceNFT from "../../contracts/MatrixMarketplaceNFT.cdc"

transaction(nftId: UInt64, amount: UFix64, royaltyReceivers: [Address], royaltyAmount: [UFix64]) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>
    let openBid: &MatrixMarketplaceOpenBid.OpenBid

    prepare(acct: AuthAccount) {
        let vaultRefPrivatePath = /private/FlowTokenVaultRefForMatrixMarketplaceOpenBid

        self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed MatrixMarketplaceNFT receiver")

        if !acct.getCapability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath)!.check() {
            acct.link<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath, target: /storage/flowTokenVault)
        }

        self.vaultRef = acct.getCapability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openBid = acct.borrow<&MatrixMarketplaceOpenBid.OpenBid>(from: MatrixMarketplaceOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketplaceOpenBid OpenBid")
    }

    execute {
        var size = royaltyReceivers.length
        if (size != royaltyAmount.length) {
            panic ("royaityReceivers, royaityaMount length not equal")
        }
        let saleCut = MatrixMarketplaceOpenBid.Cut(
                    receiver: getAccount(royaltyReceivers[0]).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!,
                    amount: royaltyAmount[0]
                )
        let saleCuts = [saleCut]
        while size > 1 {
            saleCuts.append(MatrixMarketplaceOpenBid.Cut(
                receiver: getAccount(royaltyReceivers[size-1]).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!,
                amount:  royaltyAmount[size-1]
            ))
            size = size - 1
        }

        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@MatrixMarketplaceNFT.NFT>(),
            nftId: nftId,
            cuts: saleCuts
        )
    }
}
