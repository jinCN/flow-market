import * as fcl from "@onflow/fcl";

export const getNFTsScript: string = fcl.script`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarketPlaceNFT from 0xNFT_ADDRESS
pub fun main(address: Address): [{String: String}]{
    let collection = getAccount(address)
        .getCapability(MatrixMarketPlaceNFT.collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
    let ret : [{String: String}] = []
    let ids = collection.getIDs()
    for tokenId in ids {
        let tokenInfo = collection.getMetadata(id: tokenId)
        tokenInfo["tokenId"] = tokenId.toString()
        ret.append(tokenInfo)
    }
    return ret
}`;
