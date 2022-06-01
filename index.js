const ipfsCidImporter = require('ipfs-unixfs-importer')
const MemoryBlockstore = require('blockstore-core/memory')
const Unixfs = require('ipfs-unixfs')
const CID = require('multiformats/cid')
const hasher = require('multiformats/hashes/sha2')
const dagPB = require('@ipld/dag-pb')
const fs = require('fs')
const path = require('path')
//const { Hash } = require('crypto')

/* const testDirectoryCid = 'QmXwnkFTQ2RZWKygXqVemyZsbB2eNwGDknpP7Zw8gYfnf3'
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
    cid: CID.CID.parse('QmZXiu2EJ952cR4MgPi8o9NJbbhk88zxD4TtGHHjjyFiWB'),
    path: 'IJS_Tech.svg',
    unixfs: unixfs.marshal(),
    //node: 'DAGNode'
  },
  {
    cid: CID.CID.parse('Qmc1HH1EhtHYScvocjPTp6DXz8rcEBJRKBzi4jtEHrWXUE'),
    path: 'icon.svg',
    unixfs: unixfs.marshal(),
    //node: 'DAGNode'
  },
  {
    cid: CID.CID.parse('QmSq2AyU9jPfUvTdCRsd6CL3RBqVUZbUYdvKHN9kfTVkRY'),
    path: 'tutor_Logo2.PNG',
    unixfs: unixfs.marshal(),
    //node: 'DAGNode'
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

  console.log(source)
  //for await (const cid of ipfsCidImporter.importer([{ content }], block, { onlyHash: true })) {
  for await (const cid of ipfsCidImporter.importer(source, blockstore, { onlyHash: true, wrapWithDirectory: true,  })) {
    console.log(cid)
  }
} */

async function getDirectoryCid2() {
  const unixfs = new Unixfs.UnixFS({ type: 'directory'})
  const bytes = dagPB.encode(dagPB.prepare({
    Data: unixfs.marshal(),
    Links: [
      {
        Hash: CID.CID.parse('QmZXiu2EJ952cR4MgPi8o9NJbbhk88zxD4TtGHHjjyFiWB'),
        Name: 'IJS_Tech.svg',
        Tsize: 9882 + 8
      },
      {
        Hash: CID.CID.parse('Qmc1HH1EhtHYScvocjPTp6DXz8rcEBJRKBzi4jtEHrWXUE'),
        Name: 'icon.svg',
        Tsize: 3245 + 8
      },
      {
        Hash: CID.CID.parse('QmSq2AyU9jPfUvTdCRsd6CL3RBqVUZbUYdvKHN9kfTVkRY'),
        Name: 'tutor_Logo2.PNG',
        Tsize: 33040 + 8
      }
    ]
  }))

  //console.log(bytes)
  const hash = await hasher.sha256.digest(bytes)
  const cid = CID.CID.create(0, dagPB.code, hash)

  console.log(cid, '=>', Buffer.from(bytes).toString('hex'))

  const decoded = dagPB.decode(bytes)

  console.log(decoded)
  //console.log(`decoded "Data": ${new TextDecoder().decode(decoded.Data)}`)
  console.log(cid);
  const file1Length = fs.readFileSync(path.join(process.cwd(), 'test', '_media', 'icon.svg')).length
  const file2Length = fs.readFileSync(path.join(process.cwd(), 'test', '_media', 'tutor_Logo2.PNG')).length
  const file3Length = fs.readFileSync(path.join(process.cwd(), 'test', '_media', 'IJS_Tech.svg')).length
  console.log(file1Length, file2Length, file3Length)
}

/* async function getCid(filepath) {
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
} */

// Get content's cid
//createFileSourceArray('./test')
getDirectoryCid2()

