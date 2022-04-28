import * as fcl from "@onflow/fcl";

export const initOpenBid: string = fcl.transaction`
import MatrixMarketplaceOpenBid from 0xOPENBID_ADDRESS

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketplaceOpenBid.OpenBid>(from: MatrixMarketplaceOpenBid.OpenBidStoragePath) == nil {
            let OpenBid <- MatrixMarketplaceOpenBid.createOpenBid() as! @MatrixMarketplaceOpenBid.OpenBid
            acct.save(<-OpenBid, to: MatrixMarketplaceOpenBid.OpenBidStoragePath)
            acct.link<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(MatrixMarketplaceOpenBid.OpenBidPublicPath, target: MatrixMarketplaceOpenBid.OpenBidStoragePath)
        }
    }
}`;
