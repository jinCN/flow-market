// SetupAccount2Transaction.cdc
import FungibleToken from "../contracts/lib/FungibleToken.cdc"
import MatrixMarketPlaceNFT from "../contracts/MatrixMarketPlaceNFT.cdc"
import FlowToken from "../contracts/lib/FlowToken.cdc"
import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"

// This transaction adds an empty Vault to account 0x02
// and mints an NFT with id=1 that is deposited into
// the NFT collection on account 0x01.
transaction(recipients: [Address], metadata: [{String: String}], royaltyAddress: Address, royaltyFee: UFix64) {

  // Private reference to this account's minter resource
  let minterRef: &MatrixMarketPlaceNFT.Minter


  prepare(acct: AuthAccount) {

    // Create a public Receiver capability to the Vault
    let ReceiverRef = acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>(/public/flowTokenReceiver, target: /storage/flowTokenVault)

    // Borrow a reference for the NFTMinter in storage   acct1 is minter
    self.minterRef = acct.borrow<&MatrixMarketPlaceNFT.Minter>(from: MatrixMarketPlaceNFT.minterStoragePath)
        ?? panic("Could not borrow owner's NFT minter reference")
  }
  execute {
    // Get the recipient's public account object
    let recipient = getAccount(recipients[size - 1])
    let ros = [MatrixMarketPlaceNFT.Royalty(address: recipients, fee: royaltyFee)]
    // Get the Collection reference for the receiver
    // getting the public capability and borrowing a reference from it

    let receiverRef = recipient.getCapability<&{NonFungibleToken.Receiver}>(MatrixMarketPlaceNFT.collectionPublicPath)

    // Mint an NFT and deposit   it into account 0x01's collection
    self.minterRef.mintTo(creator: receiverRef, metadata: metadata, royalties: ros)
    log("New NFT minted for account 1")
  }
}
