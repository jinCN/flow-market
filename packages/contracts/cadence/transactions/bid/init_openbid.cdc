import MatrixMarketOpenOffer from "../../contracts/MatrixMarketOpenOffer.cdc"

// This transaction installs the OpenOffer resource in an account.

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketOpenOffer.OpenOffer>(from: MatrixMarketOpenOffer.OpenOfferStoragePath) == nil {
            let OpenOffer <- MatrixMarketOpenOffer.createOpenOffer() as! @MatrixMarketOpenOffer.OpenOffer
            acct.save(<-OpenOffer, to: MatrixMarketOpenOffer.OpenOfferStoragePath)
            acct.link<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(MatrixMarketOpenOffer.OpenOfferPublicPath, target: MatrixMarketOpenOffer.OpenOfferStoragePath)
        }
    }
}
