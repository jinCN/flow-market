const childProcess = require('child_process')
exports.spawnEmulator = async (command, args, options = {}) => {
  const process = childProcess.spawn(command, args, options)
  return new Promise(function (resolve, reject) {
    let internalId
    let initialized
    const checkLiveness = async function () {
      try {
        await exports.execNoLog('flow blocks get latest')
        clearInterval(internalId)
        initialized = true
        resolve(process)
      } catch (err) {
        console.log(`err:`, err)
      }
    }
    internalId = setInterval(checkLiveness, 1000)
    
    process.on('exit', function (code) { // Should probably be 'exit', not 'close'
      if (!initialized) {
        reject(new Error(`exited with code: ${code}`))
      }
    })
    process.on('error', function (err) {
      if (!initialized) {
        reject(err)
      }
    })
  })
}

exports.exec = async (command, options = {}) => {
  return new Promise(function (resolve, reject) {
    childProcess.exec(command, options, (error, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)
      
      if (error) {
        reject(new Error(`${error}\n${stderr}`))
      } else {
        resolve(stdout)
      }
    })
  })
}

exports.execNoLog = async (command, options = {}) => {
  return new Promise(function (resolve, reject) {
    childProcess.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${error}\n${stderr}`))
      } else {
        resolve(stdout)
      }
    })
  })
}
