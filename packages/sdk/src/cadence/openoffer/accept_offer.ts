import * as fcl from "@onflow/fcl";

// language=Cadence
export const acceptOffer: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

import 0xsupportedNFTName from 0xsupportedNFTAddress

transaction(bidId: UInt64, openOfferAddress: Address) {
    let nft: @NonFungibleToken.NFT
    let receiver: &{FungibleToken.Receiver}
    let openOffer: &MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}
    let bid: &MatrixMarketOpenOffer.Offer{MatrixMarketOpenOffer.OfferPublic}
    
    let storefront: &NFTStorefront.Storefront
    let toDelist: UInt64?
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
        let storefront = getAccount(address)
        .getCapability(NFTStorefront.StorefrontPublicPath)
        .borrow<&{NFTStorefront.StorefrontPublic}>() ?? panic("StorefrontPublicPath not found")
        self.storefront = storefront
        let ids = storefront.getListingIDs()
        var i = 0
        self.toDelist = null
        while i < ids.length {
            let listing = storefront.borrowListing(listingResourceID: ids[i])
            ?? panic("No item with that ID")
            let detail = listing.getDetails()
            if(detail.nftType==Type<@0xsupportedNFTName.NFT>()&&detail.nftID==nftId){
                self.toDelist = ids[i]
                break
            }
        }
        
        let nftCollection = acct.borrow<&0xsupportedNFTName.Collection>(
            from: 0xsupportedNFTName.CollectionStoragePath
        ) ?? panic("Cannot borrow NFT collection receiver from account")
        self.nft <- nftCollection.withdraw(withdrawID: nftId)

        let salePaymentVaultType = self.bid.getDetails().vaultType
        var tokenReceiverPath = /public/flowTokenReceiver

        if(salePaymentVaultType == Type<@FlowToken.Vault>()){
        
        }else if(salePaymentVaultType == Type<@FUSD.Vault>()){
            tokenReceiverPath = /public/fusdReceiver
        }else{
            panic("unsupported paymentToken")
        }
        self.receiver = acct.getCapability(tokenReceiverPath)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")
    }

    execute {
        let vault <- self.bid.purchase(item: <-self.nft)!
        self.receiver.deposit(from: <-vault)
        self.openOffer.cleanup(bidId: bidId)
        if(self.toDelist!=null){
            self.storefront.removeListing(listingResourceID: self.toDelist!)
        }
    }
}`;
