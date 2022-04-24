import MatrixMarketplaceOpenBid from "../../contracts/MatrixMarketplaceOpenBid.cdc"

// This script returns an array of all the nft uuids for sale through a OpenBid

pub fun main(acct: Address): [UInt64] {
    let OpenBidRef = getAccount(acct)
        .getCapability<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(
            MatrixMarketplaceOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    return OpenBidRef.getBidIds()
}
