import * as fcl from "@onflow/fcl";

export const mintNFTs: string = fcl.script`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketplaceNFT from 0xNFT_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS

// This transaction adds an empty Vault to account 0x02
// and mints an NFT with id=1 that is deposited into
// the NFT collection on account 0x01.
transaction(recipientBatch: [Address], subCollectionIdBatch: [String], metadataBatch: [{String:String}]) {

  let minter: &MatrixMarketplaceNFT.NFTMinter
  let creator: AuthAccount

  prepare(acct: AuthAccount) {
    self.minter = getAccount(0xNFT_ADDRESS).getCapability(MatrixMarketplaceNFT.MinterPublicPath)
                                  .borrow<&MatrixMarketplaceNFT.NFTMinter>()
                                  ?? panic("Could not borrow minter capability from public collection")
    self.creator = acct;
  }

  execute {
    var size = recipientBatch.length
    // check all args length
    if (size != subCollectionIdBatch.length || size != metadataBatch.length) {
      panic ("recipientBatch, subCollectionIdBatch, metadataBatch length not equal")
    }

    while size > 0 {
      let recipientAccount = getAccount(recipientBatch[size - 1])
      let subCollectionId = subCollectionIdBatch[size - 1]
      let metadata = {metadataBatch[size - 1][0] :metadataBatch[size - 1][1]}
      let recipient = recipientAccount.getCapability(MatrixMarketplaceNFT.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("recipient collection not found")
      self.minter.mintNFT(creator: self.creator, recipient: recipient, subCollectionId: subCollectionId, metadata: metadata)
      size = size - 1
    }
  }
}`;
