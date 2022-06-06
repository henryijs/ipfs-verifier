const CID = require('multiformats/cid')
const Unixfs = require('ipfs-unixfs')
const hasher = require('multiformats/hashes/sha2')
const dagPB = require('@ipld/dag-pb')
const ipfsClient = require('ipfs-http-client')

function createIpfsFileSourceArray(sourceCid) {
  const sourceArray = new Array()
  sourceArray.push(await getDirectoryCid(sourceCid))
  console.log(sourceArray)
  return sourceArray
}

function listSubDirectoryFile(sourceCid) {
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

async function getDirectoryCid(sourceCid) {
  const ipfs = await ipfsClient.create('http://localhost:5001/api/v0')
  //const ipfsFileArray = new Array()
  for await (const file of ipfs.ls(sourceCid)) {
    console.log(file)
    if (file.type === 'dir') {
      return getDirectoryCid(file.cid)
    } else {
      const stat = await ipfs.files.stat('/ipfs/' + file.cid)
      console.log('cumulativeSize: ' + stat.cumulativeSize)
      return {
        Hash: file.cid.toString(),
        Name: file.name,
        Tsize: stat.cumulativeSize
      }
    }
  }
  //console.log(ipfsFileArray)
}

async function hashCid(sourceCid) {
  const fileArray = new Array()
  fileArray.push(await createIpfsFileSourceArray(sourceCid))
  console.log(fileArray)
  const unixfs = new Unixfs.UnixFS({ type: 'directory' })
  const bytes = dagPB.encode(dagPB.prepare({
    Data: unixfs.marshal(),
    Links: fileArray/* [
      // Hash = CID, Name = Filename with sub-dir, Tsize = File size in DAG-PB IPLD - cumulativeSize (uint64)
      {
        Hash: CID.CID.parse('QmZXiu2EJ952cR4MgPi8o9NJbbhk88zxD4TtGHHjjyFiWB'),
        Name: 'IJS_Tech.svg',
        Tsize: 9893
      },
      {
        Hash: CID.CID.parse('Qmc1HH1EhtHYScvocjPTp6DXz8rcEBJRKBzi4jtEHrWXUE'),
        Name: 'icon.svg',
        Tsize: 3256
      },
      {
        Hash: CID.CID.parse('QmSq2AyU9jPfUvTdCRsd6CL3RBqVUZbUYdvKHN9kfTVkRY'),
        Name: 'tutor_Logo2.PNG',
        Tsize: 33054
      }
    ] */
    })
  )
  //console.log(bytes)
  const hash = await hasher.sha256.digest(bytes)
  const cid = CID.CID.create(0, dagPB.code, hash)
  //console.log(cid, '=>', Buffer.from(bytes).toString('hex'))
  const decoded = dagPB.decode(bytes)
  //console.log(decoded)
  //console.log(cid)
  return cid.toString()
}

// test/_media
const testDirectoryCid = 'QmQbwtYnN12SQEJHpRm8UztMD8LbqAssxt2jMeDFceiJVz'
const newCid = hashCid('QmVW7mXm2KGipfEC9w3k3h56bxedmxbmdiY3hxdyQFLeMF').toString()
console.log(newCid)
if (newCid === testDirectoryCid) {
  console.log(true)
}