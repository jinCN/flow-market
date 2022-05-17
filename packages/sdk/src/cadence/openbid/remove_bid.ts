import * as fcl from "@onflow/fcl";

export const removeOpenBid: string = fcl.transaction`
import MatrixMarketOpenBid from 0xOPENBID_ADDRESS

transaction(bidId: UInt64) {
    let openBid: &MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidManager}

    prepare(acct: AuthAccount) {
        self.openBid = acct.borrow<&MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidManager}>(from: MatrixMarketOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketOpenBid.OpenBid")
    }

    execute {
        self.openBid.removeBid(bidId: bidId)
    }
}`;
