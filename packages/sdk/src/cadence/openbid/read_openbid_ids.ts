import * as fcl from "@onflow/fcl";

export const getBidIds: string = fcl.script`
import MatrixMarketOpenBid from 0xOPENBID_ADDRESS

pub fun main(acct: Address): [UInt64] {
    let OpenBidRef = getAccount(acct)
        .getCapability<&MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidPublic}>(
            MatrixMarketOpenBid.OpenBidPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenBid from address")

    return OpenBidRef.getBidIds()
}`;
