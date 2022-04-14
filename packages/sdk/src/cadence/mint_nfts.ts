import * as fcl from "@onflow/fcl";

export const mintNFTs: string = fcl.transaction`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketplaceNFT from 0xNFT_ADDRESS

transaction(nftAdminAddress: Address, recipientBatch: [Address], subCollectionIdBatch: [String], metadataBatch: [{String:String}]) {

  let minter: &MatrixMarketplaceNFT.NFTMinter
  let creator: AuthAccount

  prepare(acct: AuthAccount) {
    self.minter = getAccount(nftAdminAddress).getCapability(MatrixMarketplaceNFT.MinterPublicPath)
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
      let metadata = metadataBatch[size - 1]
      let recipient = recipientAccount.getCapability(MatrixMarketplaceNFT.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("recipient collection not found")
      self.minter.mintNFT(creator: self.creator, recipient: recipient, subCollectionId: subCollectionId, metadata: metadata)
      size = size - 1
    }
  }
}`;
