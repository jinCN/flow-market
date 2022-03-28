import MatrixMarketPlaceOpenBid from "../../contracts/MatrixMarketPlaceOpenBid.cdc"

// This transaction installs the OpenBid resource in an account.

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketPlaceOpenBid.OpenBid>(from: MatrixMarketPlaceOpenBid.OpenBidStoragePath) == nil {
            let OpenBid <- MatrixMarketPlaceOpenBid.createOpenBid() as! @MatrixMarketPlaceOpenBid.OpenBid
            acct.save(<-OpenBid, to: MatrixMarketPlaceOpenBid.OpenBidStoragePath)
            acct.link<&MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidPublic}>(MatrixMarketPlaceOpenBid.OpenBidPublicPath, target: MatrixMarketPlaceOpenBid.OpenBidStoragePath)
        }
    }
}
