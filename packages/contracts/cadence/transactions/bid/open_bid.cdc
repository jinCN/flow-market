import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketOpenOffer from "../../contracts/MatrixMarketOpenOffer.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"
import MatrixMarket from "../../contracts/MatrixMarket.cdc"

transaction(nftId: UInt64, amount: UFix64, royaltyReceivers: [Address], royaltyAmount: [UFix64]) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>
    let openOffer: &MatrixMarketOpenOffer.OpenOffer

    prepare(acct: AuthAccount) {
        let vaultRefPrivatePath = /private/flowTokenVaultRefForMatrixMarketOpenOffer

        self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarket.CollectionPublicPath)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed MatrixMarket receiver")

        if !acct.getCapability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath)!.check() {
            acct.link<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath, target: /storage/flowTokenVault)
        }

        self.vaultRef = acct.getCapability<&{FungibleToken.Receiver,FungibleToken.Balance,FungibleToken.Provider}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openOffer = acct.borrow<&MatrixMarketOpenOffer.OpenOffer>(from: MatrixMarketOpenOffer.OpenOfferStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketOpenOffer OpenOffer")
    }

    execute {
        var size = royaltyReceivers.length
        if (size != royaltyAmount.length) {
            panic ("royaityReceivers, royaityaMount length not equal")
        }
        let saleCut = MatrixMarketOpenOffer.Cut(
                    receiver: getAccount(royaltyReceivers[0]).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!,
                    amount: royaltyAmount[0]
                )
        let saleCuts = [saleCut]
        while size > 1 {
            saleCuts.append(MatrixMarketOpenOffer.Cut(
                receiver: getAccount(royaltyReceivers[size-1]).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!,
                amount:  royaltyAmount[size-1]
            ))
            size = size - 1
        }

        self.openOffer.createOffer(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@MatrixMarket.NFT>(),
            nftId: nftId,
            cuts: saleCuts
        )
    }
}
