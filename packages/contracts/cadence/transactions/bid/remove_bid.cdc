import MatrixMarketOpenBid from "../../contracts/MatrixMarketOpenBid.cdc"

transaction(bidId: UInt64) {
    let openBid: &MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidManager}

    prepare(acct: AuthAccount) {
        self.openBid = acct.borrow<&MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidManager}>(from: MatrixMarketOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketOpenBid.OpenBid")
    }

    execute {
        self.openBid.removeBid(bidId: bidId)
    }
}
