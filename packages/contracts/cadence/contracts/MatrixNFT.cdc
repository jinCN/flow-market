import NonFungibleToken from "core/NonFungibleToken.cdc"
import LicensedNFT from "LicensedNFT.cdc"

// MatrixMarketPlaceNFT token contract
//
pub contract MatrixMarketPlaceNFT : NonFungibleToken, LicensedNFT {

    pub var totalSupply: UInt64

    pub var collectionPublicPath: PublicPath
    pub var collectionStoragePath: StoragePath
    pub var minterPublicPath: PublicPath
    pub var minterStoragePath: StoragePath

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub event Mint(id: UInt64, creator: Address, metadata: {String:String}, royalties: [LicensedNFT.Royalty])
    pub event Destroy(id: UInt64)

    pub struct Royalty {
        pub let address: Address
        pub let fee: UFix64

        init(address: Address, fee: UFix64) {
            self.address = address
            self.fee = fee
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let creator: Address
        access(self) let metadata: {String:String}
        access(self) let royalties: [LicensedNFT.Royalty]

        init(id: UInt64, creator: Address, metadata: {String:String}, royalties: [LicensedNFT.Royalty]) {
            self.id = id
            self.creator = creator
            self.metadata = metadata
            self.royalties = royalties
        }

        pub fun getMetadata(): {String:String} {
            return self.metadata
        }

        pub fun getRoyalties(): [LicensedNFT.Royalty] {
            return self.royalties
        }

        destroy() {
            emit Destroy(id: self.id)
        }
    }

    pub resource interface NFTReceiver {

        pub fun deposit(token: @NonFungibleToken.NFT)

        pub fun getIDs(): [UInt64]

        pub fun idExists(id: UInt64): Bool
    }

    pub resource Collection: NFTReceiver, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, LicensedNFT.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @MatrixMarketPlaceNFT.NFT
            let id: UInt64 = token.id
            let dummy <- self.ownedNFTs[id] <- token
            destroy dummy
            emit Deposit(id: id, to: self.owner?.address)
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun idExists(id: UInt64): Bool {
            return self.ownedNFTs[id] != nil
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowMatrixMarketPlaceNFT(id: UInt64): &MatrixMarketPlaceNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &MatrixMarketPlaceNFT.NFT
            } else {
                return nil
            }
        }

        pub fun getMetadata(id: UInt64): {String:String} {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
            return (ref as! &MatrixMarketPlaceNFT.NFT).getMetadata()
        }

        pub fun getRoyalties(id: UInt64): [LicensedNFT.Royalty] {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
            return (ref as! &LicensedNFT.NFT).getRoyalties()
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource Minter {
        pub fun mintTo(creator: Capability<&{NonFungibleToken.Receiver}>, metadata: {String:String}, royalties: [LicensedNFT.Royalty]): &NonFungibleToken.NFT {
            let token <- create NFT(
                id: MatrixMarketPlaceNFT.totalSupply,
                creator: creator.address,
                metadata: metadata,
                royalties: royalties
            )
            MatrixMarketPlaceNFT.totalSupply = MatrixMarketPlaceNFT.totalSupply + 1
            let tokenRef = &token as &NonFungibleToken.NFT
            emit Mint(id: token.id, creator: creator.address, metadata: metadata, royalties: royalties)
            creator.borrow()!.deposit(token: <- token)
            return tokenRef
        }
    }

    pub fun minter(): Capability<&Minter> {
        return self.account.getCapability<&Minter>(self.minterPublicPath)
    }

    init() {
        self.totalSupply = 0
        self.collectionPublicPath = /public/MatrixMarketPlaceNFTCollection
        self.collectionStoragePath = /storage/MatrixMarketPlaceNFTCollection
        self.minterPublicPath = /public/MatrixMarketPlaceNFTMinter
        self.minterStoragePath = /storage/MatrixMarketPlaceNFTMinter

        let minter <- create Minter()
        self.account.save(<- minter, to: self.minterStoragePath)
        self.account.link<&Minter>(self.minterPublicPath, target: self.minterStoragePath)

        let collection <- self.createEmptyCollection()
        self.account.save(<- collection, to: self.collectionStoragePath)
        self.account.link<&{NFTReceiver,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>(self.collectionPublicPath, target: self.collectionStoragePath)

        emit ContractInitialized()
    }
}
