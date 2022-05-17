import MatrixMarketOpenBid from "../../contracts/MatrixMarketOpenBid.cdc"

// This transaction installs the OpenBid resource in an account.

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketOpenBid.OpenBid>(from: MatrixMarketOpenBid.OpenBidStoragePath) == nil {
            let OpenBid <- MatrixMarketOpenBid.createOpenBid() as! @MatrixMarketOpenBid.OpenBid
            acct.save(<-OpenBid, to: MatrixMarketOpenBid.OpenBidStoragePath)
            acct.link<&MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidPublic}>(MatrixMarketOpenBid.OpenBidPublicPath, target: MatrixMarketOpenBid.OpenBidStoragePath)
        }
    }
}
