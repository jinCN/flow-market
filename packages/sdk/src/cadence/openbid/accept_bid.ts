import * as fcl from "@onflow/fcl";

export const acceptBid: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MatrixMarketOpenBid from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

import 0xsupportedNFTName from 0xsupportedNFTAddress

transaction(bidId: UInt64, openBidAddress: Address) {
    let nft: @NonFungibleToken.NFT
    let mainVault: &FlowToken.Vault{FungibleToken.Receiver}
    let openBid: &MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidPublic}
    let bid: &MatrixMarketOpenBid.Bid{MatrixMarketOpenBid.BidPublic}

    prepare(acct: AuthAccount) {
        self.openBid = getAccount(openBidAddress)
            .getCapability<&MatrixMarketOpenBid.OpenBid{MatrixMarketOpenBid.OpenBidPublic}>(
                MatrixMarketOpenBid.OpenBidPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenBid from provided address")

        self.bid = self.openBid.borrowBid(bidId: bidId)
                    ?? panic("No Offer with that ID in OpenBid")
                    
        let nftId = self.bid.getDetails().nftId
        
        let nftCollection = acct.borrow<&0xsupportedNFTName.Collection>(
            from: 0xsupportedNFTName.CollectionStoragePath
        ) ?? panic("Cannot borrow NFT collection receiver from account")
        self.nft <- nftCollection.withdraw(withdrawID: nftId)

        let salePaymentVaultType = self.bid.getDetails().vaultType
        var tokenStoragePath = /storage/flowTokenVault

        if(salePaymentVaultType == Type<@FlowToken.Vault>()){
        
        }else if(salePaymentVaultType == Type<@FUSD.Vault>()){
            tokenStoragePath = /storage/fusdVault
        }else{
            panic("unsupported paymentToken")
        }
        self.mainVault = acct.borrow<&FungibleToken.Vault{FungibleToken.Receiver}>(from: tokenStoragePath)
            ?? panic("Cannot borrow vault from acct storage")
    }

    execute {
        let vault <- self.bid.purchase(item: <-self.nft)!
        self.mainVault.deposit(from: <-vault)
        self.openBid.cleanup(bidId: bidId)
    }
}`;
