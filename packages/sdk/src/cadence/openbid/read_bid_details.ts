import * as fcl from "@onflow/fcl";

export const getBidDetails: string = fcl.script`
import MatrixMarketplaceOpenBid from 0xOPENBID_ADDRESS

pub fun main(acct: Address, BidResourceId: UInt64): MatrixMarketplaceOpenBid.BidDetails {
    let OpenBidRef = getAccount(acct)
        .getCapability<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(
            MatrixMarketplaceOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    let Bid = OpenBidRef.borrowBid(bidId: BidResourceId)
        ?? panic("No item with that ID")

    return Bid.getDetails()
}`;
