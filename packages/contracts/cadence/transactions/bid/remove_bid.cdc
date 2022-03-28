import MatrixMarketPlaceOpenBid from "../../contracts/MatrixMarketPlaceOpenBid.cdc"

transaction(bidId: UInt64) {
    let openBid: &MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidManager}

    prepare(acct: AuthAccount) {
        self.openBid = acct.borrow<&MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidManager}>(from: MatrixMarketPlaceOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketPlaceOpenBid.OpenBid")
    }

    execute {
        self.openBid.removeBid(bidId: bidId)
    }
}