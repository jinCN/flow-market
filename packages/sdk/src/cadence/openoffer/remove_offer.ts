import * as fcl from "@onflow/fcl";

export const removeOpenOffer: string = fcl.transaction`
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS

transaction(bidId: UInt64) {
    let openOffer: &MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferManager}

    prepare(acct: AuthAccount) {
        self.openOffer = acct.borrow<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferManager}>(from: MatrixMarketOpenOffer.OpenOfferStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketOpenOffer.OpenOffer")
    }

    execute {
        self.openOffer.removeOffer(bidId: bidId)
    }
}`;
