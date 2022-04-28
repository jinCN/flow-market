import * as fcl from "@onflow/fcl";

export const getBidIds: string = fcl.script`
import MatrixMarketplaceOpenBid from 0xOPENBID_ADDRESS

pub fun main(acct: Address): [UInt64] {
    let OpenBidRef = getAccount(acct)
        .getCapability<&MatrixMarketplaceOpenBid.OpenBid{MatrixMarketplaceOpenBid.OpenBidPublic}>(
            MatrixMarketplaceOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    return OpenBidRef.getBidIds()
}`;
