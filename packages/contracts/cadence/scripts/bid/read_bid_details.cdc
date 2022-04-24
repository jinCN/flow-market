import MatrixMarketplaceOpenBid from "../../contracts/MatrixMarketplaceOpenBid.cdc"

// This script returns the details for a Bid within a OpenBid

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
}
