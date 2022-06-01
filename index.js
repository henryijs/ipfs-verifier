const CID = require('multiformats/cid')
const Unixfs = require('ipfs-unixfs')
const hasher = require('multiformats/hashes/sha2')
const dagPB = require('@ipld/dag-pb')


async function getDirectoryCid() {
  const unixfs = new Unixfs.UnixFS({ type: 'directory' })
  const bytes = dagPB.encode(dagPB.prepare({
    Data: unixfs.marshal(),
    Links: [
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
    ]})
  )
  //console.log(bytes)
  const hash = await hasher.sha256.digest(bytes)
  const cid = CID.CID.create(0, dagPB.code, hash)
  console.log(cid, '=>', Buffer.from(bytes).toString('hex'))
  const decoded = dagPB.decode(bytes)
  console.log(decoded)
  console.log(cid)
  return cid.toString()
}

// test/_media
// const testDirectoryCid = 'QmQbwtYnN12SQEJHpRm8UztMD8LbqAssxt2jMeDFceiJVz'
const hashedCid = getDirectoryCid()
