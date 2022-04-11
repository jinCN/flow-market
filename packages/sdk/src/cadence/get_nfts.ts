import * as fcl from "@onflow/fcl";

export const getNFTsScript: string = fcl.script`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketplaceNFT from 0xNFT_ADDRESS
pub fun main(address: Address): [UInt64]{
    let collection = getAccount(address)
        .getCapability(MatrixMarketplaceNFT.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
    let ids = collection.getIDs()

    return ids
}`;
