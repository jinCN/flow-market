import * as fcl from "@onflow/fcl";

export const getBidDetails: string = fcl.script`
import MatrixMarketOpenBid from 0xOPENBID_ADDRESS

pub fun main(acct: Address, BidResourceId: UInt64): MatrixMarketOpenBid.BidDetails {
    let OpenBidRef = getAccount(acct)
        .getCapability<&MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidPublic}>(
            MatrixMarketOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    let Bid = OpenBidRef.borrowBid(bidId: BidResourceId)
        ?? panic("No item with that ID")

    return Bid.getDetails()
}`;
