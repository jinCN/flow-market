import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketplaceNFT from "../contracts/MatrixMarketplaceNFT.cdc"

pub fun main(address: Address): [UInt64]{
    let collection = getAccount(address)
        .getCapability(MatrixMarketplaceNFT.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
    let ids = collection.getIDs()
    return ids
}