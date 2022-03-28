import MatrixMarketPlaceOpenBid from "../../../contracts/MatrixMarketPlaceOpenBid.cdc"

// This script returns the details for a Bid within a OpenBid

pub fun main(account: Address, BidResourceId: UInt64): MatrixMarketPlaceOpenBid.BidDetails {
    let OpenBidRef = getAccount(account)
        .getCapability<&MatrixMarketPlaceOpenBid.OpenBid{MatrixMarketPlaceOpenBid.OpenBidPublic}>(
            MatrixMarketPlaceOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    let Bid = OpenBidRef.borrowBid(bidId: BidResourceId)
        ?? panic("No item with that ID")
    
    return Bid.getDetails()
}
