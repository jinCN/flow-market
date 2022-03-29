import * as fcl from "@onflow/fcl";

export const initNFTCollection: string = fcl.transaction`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketPlaceNFT from 0xNFT_ADDRESS


// Setup storage for MatrixMarketPlaceNFT on signer account
transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&MatrixMarketPlaceNFT.Collection>(from: MatrixMarketPlaceNFT.collectionStoragePath) == nil {
            let collection <- MatrixMarketPlaceNFT.createEmptyCollection() as! @MatrixMarketPlaceNFT.Collection
            acct.save(<-collection, to: MatrixMarketPlaceNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MatrixMarketPlaceNFT.Metadata}>(MatrixMarketPlaceNFT.collectionPublicPath, target: MatrixMarketPlaceNFT.collectionStoragePath)
        }
    }
}`;
