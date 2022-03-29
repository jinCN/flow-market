// SetupAccount1Transaction.cdc

import FungibleToken from "../contracts/lib/FungibleToken.cdc"
import FlowToken from "../contracts/lib/FlowToken.cdc"
import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketPlaceNFT from "../contracts/MatrixMarketPlaceNFT.cdc"

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {
  prepare(acct: AuthAccount) {
    // Create a public Receiver capability to the Vault
    acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)

    log("Created Vault references")

    // store an empty NFT Collection in account storage
    acct.save<@NonFungibleToken.Collection>(<-MatrixMarketPlaceNFT.createEmptyCollection(), to: MatrixMarketPlaceNFT.collectionStoragePath)

    // publish a capability to the Collection in storage
    acct.link<&{NonFungibleToken.Receiver,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketPlaceNFT.collectionPublicPath, target: MatrixMarketPlaceNFT.collectionStoragePath)

    log("Created a new empty collection and published a reference")
  }
}
