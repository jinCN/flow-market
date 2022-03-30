// SetupAccount1Transaction.cdc

import FungibleToken from 0x9a0766d93b6608b7
import MatrixMarketPlaceNFT from 0x7f3812b53dd4de20
import FlowToken from 0x7e60df042a9c0868
import NonFungibleToken from 0x631e88ae7f1d7c20

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {
  prepare(acct: AuthAccount) {
    // Create a public Receiver capability to the Vault
    acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)

    log("Created Vault references")

    // store an empty NFT Collection in account storage
    if acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPublicPath).check() == false {
        acct.save<@NonFungibleToken.Collection>(<-MatrixMarketPlaceNFT.createEmptyCollection(), to: MatrixMarketPlaceNFT.collectionStoragePath)
    }
    // publish a capability to the Collection in storage
    acct.link<&{NonFungibleToken.Receiver,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPublicPath, target: MatrixMarketPlaceNFT.collectionStoragePath)

    log("Created a new empty collection and published a reference")
  }
}
