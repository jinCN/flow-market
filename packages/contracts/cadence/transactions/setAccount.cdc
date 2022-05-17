// SetupAccount1Transaction.cdc

import FungibleToken from "../contracts/lib/FungibleToken.cdc"
import FlowToken from "../contracts/lib/FlowToken.cdc"
import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"
import MatrixMarket from "../contracts/MatrixMarket.cdc"
// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {
  prepare(acct: AuthAccount) {
    // Create a public Receiver capability to the Vault
    acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)

    log("Created Vault references")

    // store an empty NFT Collection in account storage
    if acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarket.CollectionPublicPath).check() == false {
        acct.save<@NonFungibleToken.Collection>(<-MatrixMarket.createEmptyCollection(), to: MatrixMarket.CollectionStoragePath)
    }
    // publish a capability to the Collection in storage
    acct.link<&{NonFungibleToken.Receiver, NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarket.CollectionPublicPath, target: MatrixMarket.CollectionStoragePath)

    log("Created a new empty collection and published a reference")
  }
}
