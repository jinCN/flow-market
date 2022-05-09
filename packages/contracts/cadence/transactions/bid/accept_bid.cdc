import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0xf8d6e0586b0a20c7
import MatrixMarketplaceOpenBid from 0xf8d6e0586b0a20c7
import FlowToken from 0x0ae53cb6e3f42a79
import MatrixMarketplaceNFT from 0xf8d6e0586b0a20c7

transaction(bidId: UInt64, openBidAddress: Address) {
    let nft: @NonFungibleToken.NFT
    let mainVault: &FlowToken.Vault{FungibleToken.Receiver}
    let openBid: &MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}
    let bid: &MatrixMarketplaceOpenBid.Bid{MatrixMarketplaceOpenBid.BidPublic}

    prepare(acct: AuthAccount) {
        self.openBid = getAccount(openBidAddress)
            .getCapability<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(
                MatrixMarketplaceOpenBid.OpenBidPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenBid from provided address")

        self.bid = self.openBid.borrowBid(bidId: bidId)
                    ?? panic("No Offer with that ID in OpenBid")
        let nftId = self.bid.getDetails().nftId

        let nftCollection = acct.borrow<&MatrixMarketplaceNFT.Collection>(
            from: MatrixMarketplaceNFT.CollectionStoragePath
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
