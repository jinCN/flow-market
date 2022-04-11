// This the proposed data structure of our raw metdata should have in
// MatrixLabsRCNFT.NFT.rawMetadata which is {String: String}
// We expect the following keys when parsing the raw metadata from MatrixLabsRCNFT for all Matrix related platforms.

// No need to deploy this file, it is used for script and transaction for interacting with the NFT.


pub struct MatrixLabsRCNFTMetadataStandard {

    // On chain information
    pub let id: UInt64
    pub let uuid: UInt64?
    pub let subCollectionId: String

    // For tokens metadata not available on chain and following the same format as epi-721
    pub let token_uri: String?

    // Suggested to be used for all Matirx platforms
    pub let name: String?
    pub let title: String?
    pub let description: String?
    pub let external_domain_view_url: String?
    pub let image_url: String?
    pub let animation_url: String?
    pub let attributes: String? // JSON string

    init(
        id: UInt64,
        uuid: UInt64?,
        subCollectionId: String,
        rawMetadata: {String: String}
    ) {
        self.id = id
        self.uuid = uuid
        self.subCollectionId = subCollectionId

        self.token_uri = rawMetadata["token_uri"]

        self.name = rawMetadata["name"]
        self.title = rawMetadata["title"]
        self.description = rawMetadata["description"]
        self.external_domain_view_url = rawMetadata["external_domain_view_url"]
        self.image_url = rawMetadata["image_url"]
        self.animation_url = rawMetadata["animation_url"]
        self.attributes = rawMetadata["attributes"]
    }
}
