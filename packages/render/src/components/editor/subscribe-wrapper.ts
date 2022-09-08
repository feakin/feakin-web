import { ClientOpts } from "@braid-protocol/client";
import init, { Doc } from "diamond-types-web";

export type Status = 'connecting' | 'connected' | 'waiting'

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
const randomId = (len = 12) => (
  Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map(x => letters[x % letters.length])
    .join('')
)

export async function subscribeWrapper(agentName: string) {
  await init()

  const braidOpts: ClientOpts = {
    parseDoc(contentType, content) {
      const id = randomId()
      let doc = Doc.fromBytes(content as any, id)
      let version = doc.getLocalVersion()

      return [doc, version]
    },
    applyPatch([doc, version], patchType, patch) {
      let merge_version = doc.mergeBytes(patch)
      let new_version = doc.mergeVersions(version, merge_version)
      return [doc, new_version]
    }
  }

  return braidOpts;
}
