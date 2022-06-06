import MatrixMarketOpenOffer from "../../contracts/MatrixMarketOpenOffer.cdc"

// This script returns an array of all the nft uuids for sale through a OpenOffer

pub fun main(acct: Address): [UInt64] {
    let OpenOfferRef = getAccount(acct)
        .getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(
            MatrixMarketOpenOffer.OpenOfferPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public OpenOffer from address")

    return OpenOfferRef.getOfferIds()
}
