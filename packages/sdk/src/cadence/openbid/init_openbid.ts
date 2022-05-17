import * as fcl from "@onflow/fcl";

export const initOpenBid: string = fcl.transaction`
import MatrixMarketOpenBid from 0xOPENBID_ADDRESS

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketOpenBid.OpenBid>(from: MatrixMarketOpenBid.OpenBidStoragePath) == nil {
            let OpenBid <- MatrixMarketOpenBid.createOpenBid() as! @MatrixMarketOpenBid.OpenBid
            acct.save(<-OpenBid, to: MatrixMarketOpenBid.OpenBidStoragePath)
            acct.link<&MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidPublic}>(MatrixMarketOpenBid.OpenBidPublicPath, target: MatrixMarketOpenBid.OpenBidStoragePath)
        }
    }
}`;
