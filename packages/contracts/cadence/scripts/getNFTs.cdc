import NonFungibleToken from 0x7f3812b53dd4de20
import MatrixMarketPlaceNFT from 0xa2811f685dccc3ec

pub fun main(address: Address): [UInt64]{
    let collection = getAccount(address)
        .getCapability(MatrixMarketPlaceNFT.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
    let ids = collection.getIDs()
    return ids
}