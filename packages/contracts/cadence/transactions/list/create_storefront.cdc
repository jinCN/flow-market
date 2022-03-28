import NFTStorefront from "../../contracts/lib/NFTStorefront.cdc"

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {
  prepare(acct: AuthAccount) {

    acct.save<@NFTStorefront.Storefront>(<- NFTStorefront.createStorefront() , to: NFTStorefront.StorefrontStoragePath)

    log("storefront created")
  }
}
