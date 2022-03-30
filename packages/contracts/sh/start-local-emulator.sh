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

flow transactions send cadence/transactions/list/create_storefront.cdc --signer emulator-account2
flow transactions send cadence/transactions/list/create_storefront_capability.cdc --signer emulator-account2

flow scripts execute cadence/scripts/getNFTs.cdc 0xf8d6e0586b0a20c7
flow transactions send cadence/transactions/list/create_listing.cdc 0 2.2 --signer emulator-account2
flow transactions send cadence/transactions/list/purchase_listing.cdc 36 0x1cf0e2f2f715450 --signer emulator-account
flow scripts execute cadence/scripts/getNFTs.cdc 0xf8d6e0586b0a20c7

#testnet
flow scripts execute cadence/scripts/getNFTs.cdc 0xa2811f685dccc3ec --network=testnet
flow transactions send cadence/transactions/mintNFT_test.cdc 0xa56c5e5fd9b9ca22 --signer testnet-account --network=testnet
flow transactions send cadence/transactions/setAccount.cdc --signer testnet-account2 --network=testnet
flow transactions send cadence/transactions/mintNFT_test.cdc 0x7f3812b53dd4de20 --signer testnet-account --network=testnet
flow scripts execute cadence/scripts/getNFTs.cdc 0x7f3812b53dd4de20 --network=testnet
flow transactions send cadence/transactions/mintNFT_test.cdc 0x445697f20309b7c0 --signer testnet-account --network=testnet
flow transactions send cadence/transactions/list/create_storefront.cdc --signer testnet-account2 --network=testnet
flow transactions send cadence/transactions/list/create_storefront_capability.cdc --signer testnet-account2 --network=testnet
flow transactions send cadence/transactions/list/create_listing.cdc 0 2.2 --signer testnet-account2 --network=testnet
flow transactions send cadence/transactions/list/remove_listing.cdc 43115912 --signer testnet-account2 --network=testnet
flow transactions send cadence/transactions/mintNFT_test.cdc 0x0c2d36ee502cea9e --signer testnet-account --network=testnet

