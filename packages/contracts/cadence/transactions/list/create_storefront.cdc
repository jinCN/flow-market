import NFTStorefront from "../../contracts/lib/NFTStorefront.cdc"

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {
  prepare(acct: AuthAccount) {
    //destroy acct.load<@NFTStorefront.Storefront> (from: NFTStorefront.StorefrontStoragePath)
    if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
        acct.save<@NFTStorefront.Storefront>(<- NFTStorefront.createStorefront() , to: NFTStorefront.StorefrontStoragePath)
    }
    acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
    log("storefront created")
  }
}
