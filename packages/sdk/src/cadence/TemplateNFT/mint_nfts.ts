// language=Cadence
export const templateNFTMintNFTs: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_

transaction(recipientBatch: [Address], subCollectionIdBatch: [String], metadataBatch: [{String:String}]) {

  let minter: &_NFT_NAME_.NFTMinter
  let creator: AuthAccount

  prepare(acct: AuthAccount) {
    self.minter = acct.borrow<&_NFT_NAME_.NFTMinter>(from: _NFT_NAME_.MinterStoragePath)
            ?? panic("could not borrow minter reference")
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
      let recipient = recipientAccount.getCapability(_NFT_NAME_.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("recipient collection not found")
      self.minter.mintNFT(creator: self.creator, recipient: recipient, subCollectionId: subCollectionId, metadata: metadata)
      size = size - 1
    }
  }
}`;
