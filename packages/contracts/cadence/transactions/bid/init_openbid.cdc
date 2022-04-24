import MatrixMarketplaceOpenBid from "../../contracts/MatrixMarketplaceOpenBid.cdc"

// This transaction installs the OpenBid resource in an account.

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketplaceOpenBid.OpenBid>(from: MatrixMarketplaceOpenBid.OpenBidStoragePath) == nil {
            let OpenBid <- MatrixMarketplaceOpenBid.createOpenBid() as! @MatrixMarketplaceOpenBid.OpenBid
            acct.save(<-OpenBid, to: MatrixMarketplaceOpenBid.OpenBidStoragePath)
            acct.link<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(MatrixMarketplaceOpenBid.OpenBidPublicPath, target: MatrixMarketplaceOpenBid.OpenBidStoragePath)
        }
    }
}
