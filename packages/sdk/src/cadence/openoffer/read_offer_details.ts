import * as fcl from "@onflow/fcl";

export const getOfferDetails: string = fcl.script`
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS

pub fun main(acct: Address, OfferResourceId: UInt64): MatrixMarketOpenOffer.OfferDetails {
    let OpenOfferRef = getAccount(acct)
        .getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(
            MatrixMarketOpenOffer.OpenOfferPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenOffer from address")

    let Offer = OpenOfferRef.borrowOffer(bidId: OfferResourceId)
        ?? panic("No item with that ID")

    return Offer.getDetails()
}`;
