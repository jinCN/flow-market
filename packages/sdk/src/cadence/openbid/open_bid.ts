import * as fcl from "@onflow/fcl";

export const openBid: string = fcl.transaction`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarket from 0xNFT_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MatrixMarketOpenBid from 0xOPENBID_ADDRESS

transaction(nftId: UInt64, amount: UFix64) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>
    let openBid: &MatrixMarketOpenBid.OpenBid

    prepare(acct: AuthAccount) {
        let vaultRefPrivatePath = /private/FlowTokenVaultRefForMatrixMarketOpenBid

        self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarket.CollectionPublicPath)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed MatrixMarket receiver")

        if !acct.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!.check() {
            acct.link<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath, target: /storage/flowTokenVault)
        }

        self.vaultRef = acct.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openBid = acct.borrow<&MatrixMarketOpenBid.OpenBid>(from: MatrixMarketOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketOpenBid OpenBid")
    }

    execute {
        let cut = MatrixMarketOpenBid.Cut(
            receiver: getAccount(0x00).getCapability<&{FungibleToken.Receiver}>(/public/NFTCollection),
            amount: amount
        )
        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@MatrixMarket.NFT>(),
            nftId: nftId,
            cuts: []
        )
    }
}`;
