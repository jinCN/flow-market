import * as fcl from "@onflow/fcl";

export const initOpenOffer: string = fcl.transaction`
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketOpenOffer.OpenOffer>(from: MatrixMarketOpenOffer.OpenOfferStoragePath) == nil {
            let OpenOffer <- MatrixMarketOpenOffer.createOpenOffer() as! @MatrixMarketOpenOffer.OpenOffer
            acct.save(<-OpenOffer, to: MatrixMarketOpenOffer.OpenOfferStoragePath)
            acct.link<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(MatrixMarketOpenOffer.OpenOfferPublicPath, target: MatrixMarketOpenOffer.OpenOfferStoragePath)
        }
    }
}`;
