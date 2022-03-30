// SetupAccount2Transaction.cdc
import FungibleToken from 0x9a0766d93b6608b7
import MatrixMarketPlaceNFT from 0x7f3812b53dd4de20
import FlowToken from 0x7e60df042a9c0868
import NonFungibleToken from 0x631e88ae7f1d7c20

// This transaction adds an empty Vault to account 0x02
// and mints an NFT with id=1 that is deposited into
// the NFT collection on account 0x01.
transaction(recipientAddress: Address) {

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
    let recipient = getAccount(recipientAddress)
    let ros = [MatrixMarketPlaceNFT.Royalty(address: recipientAddress, fee: 1.2)]
    // Get the Collection reference for the receiver
    // getting the public capability and borrowing a reference from it

    let receiverRef = recipient.getCapability<&{NonFungibleToken.Receiver}>(MatrixMarketPlaceNFT.collectionPublicPath)

    // Mint an NFT and deposit   it into account 0x01's collection
    self.minterRef.mintTo(creator: receiverRef, metadata: {"qwe":"123"}, royalties: ros)
    log("New NFT minted for account 1")
  }
}
