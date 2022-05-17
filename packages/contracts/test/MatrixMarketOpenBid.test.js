const { expect, assert } = require('chai')
const testConsole = require('test-console')

const helper = require('./utils/helper')

describe('MatrixMarketOpenBid basic test', function () {
  this.timeout(60000)
  let Admin = '0xf8d6e0586b0a20c7'
  let AddressA = '0x01cf0e2f2f715450'

  let output = ''
  let checkLog = (match, flush = true) => {
    if (!match || output.includes(match)) {
    } else {
      assert.fail(`Log not found: ${match}`)
    }
    if (flush) {
      output = ''
    }
  }
  let checkNoLog = (match, flush = true) => {
    if (output.includes(match)) {
      assert.fail(`Error with log: ${match}`)
    }
    if (flush) {
      output = ''
    }
  }
  before(async () => {
    let stdoutInspect = testConsole.stdout.inspect()
    stdoutInspect.on('data', (chunk) => {
      output += chunk
      process.stdout._write(chunk)
    })
    let stderrInspect = testConsole.stderr.inspect()
    stderrInspect.on('data', (chunk) => {
      output += chunk
      process.stderr._write(chunk)
    })
    await helper.spawnEmulator('flow', ['emulator', 'start'])
    await helper.exec('flow accounts create --key 4be877dc2495ee172193ca602542c1a19407720932392c776104767c6ab559ee50db72a7221d20112f40199f2d00cc1aa008f81a8dfec27d7134ae0ef1260bd1')
    await helper.exec('flow project deploy')
    await helper.exec('flow transactions send ./cadence/transactions/emulator/TransferFlowToken.cdc 100.0 0x01cf0e2f2f715450')
    checkLog('All contracts deployed successfully')
  })

  it('Set Account transaction', async () => {
    await helper.exec('flow transactions send cadence/transactions/setAccount.cdc --signer emulator-account2' )
    await helper.exec('flow transactions send cadence/transactions/setAccount.cdc --signer emulator-account' )
  })

  it('Get NFTs script', async () => {
    console.log(await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + Admin))
    console.log(await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + AddressA))
    checkNoLog('❌', false)
    checkLog(`Result: [`)
  })

  it('Mint NFT transaction', async () => {
    await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + AddressA)
    checkLog(`Result: []`)
    await helper.exec('flow transactions send cadence/transactions/create_public_minter_for_factory.cdc --signer emulator-account' )
    await helper.exec('flow transactions send cadence/transactions/mintNFT_test.cdc ' + Admin + ' [' + Admin + '] --signer emulator-account2' )
    console.log(await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + Admin))
    checkLog(`Result: [0]`)
  })

  it('Init open for bid transaction', async () => {
    await helper.exec('flow transactions send cadence/transactions/bid/init_openbid.cdc --signer emulator-account2' )
    await helper.exec('flow transactions send cadence/transactions/bid/init_openbid.cdc --signer emulator-account' )
  })

  it('Read bid ids script', async () => {
    await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AddressA)
    checkNoLog('❌', false)
    checkLog(`Result: [`)
  })

  it('Open&Remove bid transaction', async () => {
    await helper.exec('flow transactions send cadence/transactions/bid/open_bid.cdc 0 1.1 ' + '[' + Admin + ']' + ' [' + 0.123 + ']' + ' --signer emulator-account2' )
    var retLog = await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AddressA)
    checkLog(`Result: [`)
    var openbidId = Number(retLog.replace('Result: [', '').replace(']', ''))
    await helper.exec('flow transactions send cadence/transactions/bid/remove_bid.cdc ' + openbidId + ' --signer emulator-account2' )
    await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AddressA)
    checkLog(`Result: []`)
  })

  it('Read bid details script', async () => {
    await helper.exec('flow transactions send cadence/transactions/bid/open_bid.cdc 0 1.1 ' + '[' + Admin + ']' + ' [' + 0.123 + ']' + ' --signer emulator-account2' )
    var retLog = await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AddressA)
    checkLog(`Result: [`)
    var openbidId = Number(retLog.replace('Result: [', '').replace(']', ''))
    await helper.exec('flow scripts execute cadence/scripts/bid/read_bid_details.cdc ' + AddressA + ' ' + openbidId)
    checkNoLog('❌', false)
    checkLog(`Result: A.f8d6e0586b0a20c7.MatrixMarketOpenBid.BidDetails(bidId: `)
  })

  it('accept bid transaction', async () => {
    // await helper.exec('flow transactions send cadence/transactions/bid/open_bid.cdc 0 1.1 ' + '[' + Admin + ']' + ' [' + 0.123 + ']' + ' --signer emulator-account2' )
    var retLog = await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AddressA)
    checkLog(`Result: [`)
    var openbidId = Number(retLog.replace('Result: [', '').replace(']', ''))
    await helper.exec('flow transactions send cadence/transactions/bid/accept_bid.cdc ' + openbidId + ' ' + AddressA + ' --signer emulator-account' )
    await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + Admin)
    checkLog(`Result: []`)
    await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + AddressA)
    checkLog(`Result: [0]`)
  })
})
