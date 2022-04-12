import * as fcl from "@onflow/fcl";

export const initNFTCollection: string = fcl.transaction`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketplaceNFT from 0xNFT_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS


// Setup storage for MatrixMarketplaceNFT on signer account
transaction {
    prepare(acct: AuthAccount) {
        acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)
        if acct.borrow<&MatrixMarketplaceNFT.Collection>(from: MatrixMarketplaceNFT.CollectionStoragePath) == nil {
            let collection <- MatrixMarketplaceNFT.createEmptyCollection() as! @MatrixMarketplaceNFT.Collection
            acct.save(<-collection, to: MatrixMarketplaceNFT.CollectionStoragePath)
            acct.link<&{NonFungibleToken.Receiver,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath, target: MatrixMarketplaceNFT.CollectionStoragePath)
        }
    }
}`;
