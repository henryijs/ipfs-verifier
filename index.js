const ipfsCidImporter = require('ipfs-unixfs-importer')
const MemoryBlockstore = require('blockstore-core/memory')
const fs = require('fs')
const path = require('path')

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
getCid(path.resolve('./test'))

