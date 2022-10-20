const fs = require('fs')
const os = require('os')

function tmpFilePath() {
  const tempDirPath = os.tmpdir()
  return `${tempDirPath}/test.sol`
}

function storeAsFile(code) {
  const filePath = tmpFilePath()

  fs.writeFileSync(filePath, code, 'utf-8')

  return filePath
}

function removeTmpFiles() {
  try {
    fs.unlinkSync(tmpFilePath())
  } catch (err) {
    // console.log(err);
  }
}

module.exports = { tmpFilePath, storeAsFile, removeTmpFiles }
