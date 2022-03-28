import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"
import MatrixMarketPlaceNFT from "../../contracts/MatrixMarketPlaceNFT.cdc"
import MatrixMarketPlaceOpenBid from "../../contracts/MatrixMarketPlaceOpenBid.cdc"

transaction(bidId: UInt64, openBidAddress: Address) {
    let nft: @NonFungibleToken.NFT
    let mainVault: &FlowToken.Vault{FungibleToken.Receiver}
    let openBid: &MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidPublic}
    let bid: &MatrixMarketPlaceOpenBid.Bid{MatrixMarketPlaceOpenBid.BidPublic}

    prepare(acct: AuthAccount) {
        self.openBid = getAccount(openBidAddress)
            .getCapability<&MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidPublic}>(
                MatrixMarketPlaceOpenBid.OpenBidPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenBid from provided address")

        self.bid = self.openBid.borrowBid(bidId: bidId)
                    ?? panic("No Offer with that ID in OpenBid")
        let nftId = self.bid.getDetails().nftId

        let nftCollection = acct.borrow<&MatrixMarketPlaceNFT.Collection>(
            from: /storage/NFTCollection
        ) ?? panic("Cannot borrow NFT collection receiver from account")
        self.nft <- nftCollection.withdraw(withdrawID: nftId)

        self.mainVault = acct.borrow<&FlowToken.Vault{FungibleToken.Receiver}>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
    }

    execute {
        let vault <- self.bid.purchase(item: <-self.nft)!
        self.mainVault.deposit(from: <-vault)
        self.openBid.cleanup(bidId: bidId)
    }
}
