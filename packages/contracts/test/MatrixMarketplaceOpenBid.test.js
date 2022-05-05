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
    checkLog('✨ All contracts deployed successfully')
  })
  
  it('Simple script', async () => {
    await helper.exec('flow scripts execute cadence/scripts/test.cdc a')
    checkNoLog('❌', false)
    checkLog(`Result: {"a": "a"`)
  })
  
})
