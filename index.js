const ipfsCidImporter = require('ipfs-unixfs-importer')
const MemoryBlockstore = require('blockstore-core/memory')
const Unixfs = require('ipfs-unixfs')
const fs = require('fs')
const path = require('path')

const testDirectoryCid = 'QmXwnkFTQ2RZWKygXqVemyZsbB2eNwGDknpP7Zw8gYfnf3'
const testTxtCid = 'QmVj6Nc12T2DppxorEzFX5U9GsyWTEqBDxt7d4AWSotxv7'


function createFileSourceArray(dirPath) {
  const sourceArray = new Array()
  sourceArray.push(listSubDirectoryFile(dirPath))
  console.log(sourceArray)
}

function listSubDirectoryFile(dirPath) {
  const dirList = fs.readdirSync(dirPath).forEach(file => {
    const absolute = path.join(dirPath, file)
    if (fs.statSync(absolute).isDirectory()) {
      return listSubDirectoryFile(absolute)
    } else {
      console.log(dirPath + ' ' + file)
      return { dirPath, file }
    }
  })
}

async function getDirectoryCid(dirPath, fileName) {
  //console.log(dirPath + ' ' + fileName)
  const blockstore = new MemoryBlockstore.MemoryBlockstore()
  const unixfs = new Unixfs.UnixFS({ type: 'file'})
  const source = [{
    cid: 'QmZXiu2EJ952cR4MgPi8o9NJbbhk88zxD4TtGHHjjyFiWB',
    path: 'IJS_Tech.svg',
    unixfs,
    size: 9882
  },
  {
    cid: 'Qmc1HH1EhtHYScvocjPTp6DXz8rcEBJRKBzi4jtEHrWXUE',
    path: 'icon.svg',
    unixfs,
    size: 3245
  },
  {
    cid: 'QmSq2AyU9jPfUvTdCRsd6CL3RBqVUZbUYdvKHN9kfTVkRY',
    path: 'tutor_Logo2.PNG',
    unixfs,
    size: 33040
  }
    //path: dirPath,
    //content: fs.createReadStream(fileName)
  ]
  //const content = fs.readFileSync(path)
  //const block = {
  //  get: async cid => { throw new Error(`unexpected block API get for ${cid}`) },
  //  put: async () => { throw new Error('unexpected block API put') }
  // }
  // if (typeof content === 'string') {
  //   content = new TextEncoder().encode(content)
  // }

  //for await (const cid of ipfsCidImporter.importer([{ content }], block, { onlyHash: true })) {
  for await (const cid of ipfsCidImporter.importer(source, blockstore, { onlyHash: true, wrapWithDirectory: true })) {
    console.log(cid)
  }
}

async function getCid(filepath) {
  const blockstore = new MemoryBlockstore.MemoryBlockstore()
  const source = [{
    path: filepath,
    //content: fs.createReadStream(path)
  }]
  //const content = fs.readFileSync(path)
  //const block = {
  //  get: async cid => { throw new Error(`unexpected block API get for ${cid}`) },
  //  put: async () => { throw new Error('unexpected block API put') }
  // }
  // if (typeof content === 'string') {
  //   content = new TextEncoder().encode(content)
  // }

  //for await (const cid of ipfsCidImporter.importer([{ content }], block, { onlyHash: true })) {
  for await (const cid of ipfsCidImporter.importer(source, blockstore, { onlyHash: true, wrapWithDirectory: true })) {
    console.log(cid.cid)
  }
}

// Get content's cid
//createFileSourceArray('./test')
getDirectoryCid()

