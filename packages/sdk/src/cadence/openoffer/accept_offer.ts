import * as fcl from "@onflow/fcl";

export const acceptOffer: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

import 0xsupportedNFTName from 0xsupportedNFTAddress

transaction(bidId: UInt64, openOfferAddress: Address) {
    let nft: @NonFungibleToken.NFT
    let mainVault: &FlowToken.Vault{FungibleToken.Receiver}
    let openOffer: &MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}
    let bid: &MatrixMarketOpenOffer.Offer{MatrixMarketOpenOffer.OfferPublic}

    prepare(acct: AuthAccount) {
        self.openOffer = getAccount(openOfferAddress)
            .getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(
                MatrixMarketOpenOffer.OpenOfferPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenOffer from provided address")

        self.bid = self.openOffer.borrowOffer(bidId: bidId)
                    ?? panic("No Offer with that ID in OpenOffer")
                    
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
        self.openOffer.cleanup(bidId: bidId)
    }
}`;
