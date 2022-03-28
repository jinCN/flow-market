import MatrixMarketPlaceOpenBid from "../../contracts/MatrixMarketPlaceOpenBid.cdc"

transaction(bidId: UInt64, openBidAddress: Address) {
    let openBid: &MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidPublic}

    prepare(acct: AuthAccount) {
        self.openBid = getAccount(openBidAddress)
            .getCapability<&MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidPublic}>(
                MatrixMarketPlaceOpenBid.OpenBidPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenBid from provided address")
    }

    execute {
        self.openBid.cleanup(bidId: bidId)
    }
}
