import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"
import MatrixMarket from "../contracts/MatrixMarket.cdc"
pub fun main(address: Address): [UInt64]{
    let collection = getAccount(address)
            .getCapability(MatrixMarket.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
        let ids = collection.getIDs()

    return ids
}
