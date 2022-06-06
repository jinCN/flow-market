import * as fcl from "@onflow/fcl";

// language=Cadence
export const checkOpenOffer: string = fcl.script`
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS
pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(MatrixMarketOpenOffer.OpenOfferPublicPath).check()
    return ref
}
`;
