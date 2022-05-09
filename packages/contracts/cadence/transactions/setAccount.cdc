// SetupAccount1Transaction.cdc
import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0xf8d6e0586b0a20c7
import FlowToken from 0x0ae53cb6e3f42a79
import MatrixMarketplaceNFT from 0xf8d6e0586b0a20c7
// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {
  prepare(acct: AuthAccount) {
    // Create a public Receiver capability to the Vault
    acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)

    log("Created Vault references")

    // store an empty NFT Collection in account storage
    if acct.getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath).check() == false {
        acct.save<@NonFungibleToken.Collection>(<-MatrixMarketplaceNFT.createEmptyCollection(), to: MatrixMarketplaceNFT.CollectionStoragePath)
    }
    // publish a capability to the Collection in storage
    acct.link<&{NonFungibleToken.Receiver, NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarketplaceNFT.CollectionPublicPath, target: MatrixMarketplaceNFT.CollectionStoragePath)

    log("Created a new empty collection and published a reference")
  }
}
