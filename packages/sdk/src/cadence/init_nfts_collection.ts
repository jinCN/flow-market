import * as fcl from "@onflow/fcl";

export const initNFTCollection: string = fcl.transaction`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketPlaceNFT from 0xNFT_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS


// Setup storage for MatrixMarketPlaceNFT on signer account
transaction {
    prepare(acct: AuthAccount) {
        acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)
        if acct.borrow<&MatrixMarketPlaceNFT.Collection>(from: MatrixMarketPlaceNFT.collectionStoragePath) == nil {
            let collection <- MatrixMarketPlaceNFT.createEmptyCollection() as! @MatrixMarketPlaceNFT.Collection
            acct.save(<-collection, to: MatrixMarketPlaceNFT.collectionStoragePath)
            acct.link<&{NonFungibleToken.Receiver,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPublicPath, target: MatrixMarketPlaceNFT.collectionStoragePath)
        }
    }
}`;
