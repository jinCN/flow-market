import * as fcl from "@onflow/fcl";

export const getOfferIds: string = fcl.script`
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS

pub fun main(acct: Address): [UInt64] {
    let OpenOfferRef = getAccount(acct)
        .getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(
            MatrixMarketOpenOffer.OpenOfferPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenOffer from address")

    return OpenOfferRef.getOfferIds()
}`;
