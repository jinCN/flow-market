import NonFungibleToken from 0xf8d6e0586b0a20c7
import MatrixMarketplaceNFT from 0xf8d6e0586b0a20c7

pub fun main(address: Address): [UInt64]{
    let collection = getAccount(address)
            .getCapability(MatrixMarketplaceNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
        let ids = collection.getIDs()

    return ids
}