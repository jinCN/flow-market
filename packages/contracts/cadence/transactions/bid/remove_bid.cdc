import MatrixMarketplaceOpenBid from "../../contracts/MatrixMarketplaceOpenBid.cdc"

transaction(bidId: UInt64) {
    let openBid: &MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidManager}

    prepare(acct: AuthAccount) {
        self.openBid = acct.borrow<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidManager}>(from: MatrixMarketplaceOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketplaceOpenBid.OpenBid")
    }

    execute {
        self.openBid.removeBid(bidId: bidId)
    }
}