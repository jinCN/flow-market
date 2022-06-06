#!/bin/bash
export TEST_ADMIN_KEY=31a053a2003d95760d8fff623aeedcc927022d8e0767972ab507608a5f611636e81857c6c46b048be6f66eddc13f5553627861153f6ce301caf5a056d68efc29

flow accounts create --key $TEST_ADMIN_KEY

flow project deploy

flow transactions send ./cadence/transactions/emulator/TransferFlowToken.cdc 100.0 0x01cf0e2f2f715450
flow transactions send ./cadence/transactions/emulator/TransferFlowToken.cdc 100.0 0xf8d6e0586b0a20c7

flow transactions send cadence/transactions/setAccount.cdc --signer emulator-account2
flow transactions send cadence/transactions/setAccount.cdc --signer emulator-account

flow transactions send cadence/transactions/mintNFT_test.cdc 0x01cf0e2f2f715450 --signer emulator-account  # emulator-account is minter
flow transactions send cadence/transactions/mintNFT_test.cdc 0xf8d6e0586b0a20c7 --signer emulator-account

#testnet
#openbid
##mint nft
flow scripts execute cadence/scripts/getNFTs.cdc 0xa56c5e5fd9b9ca22 --network=testnet
flow transactions send cadence/transactions/mintNFT_test.cdc [0xa56c5e5fd9b9ca22] --signer testnet-account2 --network=testnet   #26
flow transactions send cadence/transactions/mintNFT_test.cdc [0xeca46256a90fc4ae] --signer testnet-account2 --network=testnet   #27
flow scripts execute cadence/scripts/getNFTs.cdc 0xeca46256a90fc4ae --network=testnet
##init openbid
flow transactions send cadence/transactions/bid/init_openbid.cdc --signer testnet-account2 --network=testnet
flow transactions send cadence/transactions/bid/init_openbid.cdc --signer testnet-account3 --network=testnet
##open_bid
flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc 0xa56c5e5fd9b9ca22 --network=testnet
flow transactions send cadence/transactions/bid/open_bid.cdc 26 1.1 --signer testnet-account3 --network=testnet
flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc 0xeca46256a90fc4ae --network=testnet
flow scripts execute cadence/scripts/bid/read_bid_details.cdc 0xeca46256a90fc4ae 89861443 --network=testnet
##remove own unpurchased bid
flow transactions send cadence/transactions/bid/remove_bid.cdc 89858406 --signer testnet-account3 --network=testnet
##accept bid
flow transactions send cadence/transactions/bid/accept_bid.cdc 89861732 0xeca46256a90fc4ae --signer testnet-account2 --network=testnet
