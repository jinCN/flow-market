import MatrixMarketplaceOpenBid from "../contracts/MatrixMarketplaceOpenBid.cdc"

transaction(bidId: UInt64, openBidAddress: Address) {
    let openBid: &MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}

    prepare(acct: AuthAccount) {
        self.openBid = getAccount(openBidAddress)
            .getCapability<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(
                MatrixMarketplaceOpenBid.OpenBidPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenBid from provided address")
    }

    execute {
        self.openBid.cleanup(bidId: bidId)
    }
}
