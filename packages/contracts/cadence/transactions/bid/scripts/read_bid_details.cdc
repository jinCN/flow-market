import MatrixMarketplaceOpenBid from "../../contracts/MatrixMarketplaceOpenBid.cdc"

// This script returns the details for a Bid within a OpenBid

pub fun main(account: Address, BidResourceID: UInt64): MatrixMarketplaceOpenBid.BidDetails {
    let OpenBidRef = getAccount(account)
        .getCapability<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(
            MatrixMarketplaceOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    let Bid = OpenBidRef.borrowBid(BidResourceID: BidResourceID)
        ?? panic("No item with that ID")
    
    return Bid.getDetails()
}
