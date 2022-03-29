import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"
import MatrixMarketPlaceNFT from "../contracts/MatrixMarketPlaceNFT.cdc"
pub fun main(address: Address): [UInt64]{
    let collection = getAccount(address)
        .getCapability(MatrixMarketPlaceNFT.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
    let ids = collection.getIDs()

    return ids
}