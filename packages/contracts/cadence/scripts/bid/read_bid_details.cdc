import MatrixMarketOpenOffer from "../../contracts/MatrixMarketOpenOffer.cdc"

// This script returns the details for a Offer within a OpenOffer

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
}
