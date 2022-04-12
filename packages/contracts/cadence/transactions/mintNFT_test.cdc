import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketplaceNFT from "../contracts/MatrixMarketplaceNFT.cdc"

// Mint MatrixWorldAssetsNFT token to recipient acct
transaction(recipientBatch: [Address]) {
    let minter: &MatrixMarketplaceNFT.NFTMinter
    let creator: AuthAccount

    prepare(acct: AuthAccount) {

        self.minter = getAccount(0x7f3812b53dd4de20).getCapability(MatrixMarketplaceNFT.MinterPublicPath)
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
