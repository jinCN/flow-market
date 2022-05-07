const { expect, assert } = require('chai')
const testConsole = require('test-console')

const helper = require('./utils/helper')

describe('MatrixMarketplaceOpenBid basic test', function () {
  this.timeout(60000)
  let Admin = '0xf8d6e0586b0a20c7'

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
    
    await helper.exec('flow project deploy')
    checkLog('All contracts deployed successfully')
  })
  
  // it('Simple script', async () => {
  //   await helper.exec('flow scripts execute cadence/scripts/test.cdc a')
  //   checkNoLog('❌', false)
  //   checkLog(`Result: {"a": "a"`)
  // })

  it('Set Account transaction', async () => {
    await helper.exec('flow transactions send cadence/transactions/setAccount.cdc --signer emulator-account' )
  })

  it('Get NFTs script', async () => {
    await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + Admin)
    checkNoLog('❌', false)
    checkLog(`Result: [`)
  })


  //
  // it('Mint NFT transaction', async () => {
  //   await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + AdddressA)
  //   checkLog(`Result: []`)
  //   await helper.exec('flow transactions send cadence/transactions/mintNFT_test.cdc [' + AdddressA + '] --signer emulator-account2' )
  //   await helper.exec('flow scripts execute cadence/scripts/getNFTs.cdc ' + AdddressA)
  //   checkLog(`Result: [1]`)
  // })
  //
  // it('Init open for bid transaction', async () => {
  //   await helper.exec('flow transactions send cadence/transactions/bid/init_openbid.cdc --signer emulator-account2' )
  // })
  //
  // it('Read bid ids script', async () => {
  //   await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AdddressA)
  //   checkNoLog('❌', false)
  //   checkLog(`Result: [`)
  // })
  //
  // it('Open&Remove bid transaction', async () => {
  //   await helper.exec('flow transactions send cadence/transactions/bid/open_bid.cdc [1] 1.1 --signer emulator-account2' )
  //   var match = await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AdddressA)
  //   console.log(match)
  //   checkLog(`Result: [`)
  //   await helper.exec('flow transactions send cadence/transactions/bid/remove_bid.cdc [1] 1.1 --signer emulator-account2' )
  //   await helper.exec('flow scripts execute cadence/scripts/bid/read_openbid_ids.cdc ' + AdddressA)
  //   checkLog(`Result: []`)
  //   await helper.exec('flow transactions send cadence/transactions/bid/open_bid.cdc [1] 1.1 --signer emulator-account2' )
  // })
  //
  // it('Read bid details script', async () => {
  //   await helper.exec('flow scripts execute cadence/scripts/read_bid_details.cdc ' + AdddressA)
  //   checkNoLog('❌', false)
  //   checkLog(`Result: {`)
  // })

})
