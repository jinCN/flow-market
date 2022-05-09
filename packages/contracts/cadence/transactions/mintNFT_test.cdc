import NonFungibleToken from 0xf8d6e0586b0a20c7
import MatrixMarketplaceNFT from 0xf8d6e0586b0a20c7

// Mint MatrixWorldAssetsNFT token to recipient acct
transaction(nftAdminAddress: Address, recipientBatch: [Address]) {
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


        while size > 0 {
            let recipientAccount = getAccount(recipientBatch[size - 1])
            let subCollectionId = "a"
            let metadata = {"qwe":"123"}
            let recipient = recipientAccount.getCapability(MatrixMarketplaceNFT.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("recipient collection not found")
            self.minter.mintNFT(creator: self.creator, recipient: recipient, subCollectionId: subCollectionId, metadata: metadata)
            size = size - 1
        }
    }
}
