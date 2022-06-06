import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"
import MatrixMarket from "../../contracts/MatrixMarket.cdc"
import MatrixMarketOpenOffer from "../../contracts/MatrixMarketOpenOffer.cdc"

transaction(bidId: UInt64, openOfferAddress: Address) {
    let nft: @NonFungibleToken.NFT
    let mainVault: &FlowToken.Vault{FungibleToken.Receiver}
    let openOffer: &MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}
    let bid: &MatrixMarketOpenOffer.Offer{MatrixMarketOpenOffer.OfferPublic}

    prepare(acct: AuthAccount) {
        self.openOffer = getAccount(openOfferAddress)
            .getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(
                MatrixMarketOpenOffer.OpenOfferPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenOffer from provided address")

        self.bid = self.openOffer.borrowOffer(bidId: bidId)
                    ?? panic("No Offer with that ID in OpenOffer")
        let nftId = self.bid.getDetails().nftId

        let nftCollection = acct.borrow<&MatrixMarket.Collection>(
            from: MatrixMarket.CollectionStoragePath
        ) ?? panic("Cannot borrow NFT collection receiver from account")
        self.nft <- nftCollection.withdraw(withdrawID: nftId)

        self.mainVault = acct.borrow<&FlowToken.Vault{FungibleToken.Receiver}>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
    }

    execute {
        let vault <- self.bid.purchase(item: <-self.nft)!
        self.mainVault.deposit(from: <-vault)
        self.openOffer.cleanup(bidId: bidId)
    }
}
