import { ClientOpts } from "@braid-protocol/client";
import init, { Doc } from "@feakin/diamond-types-web";

export type Status = 'connecting' | 'connected' | 'waiting'

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
export const randomId = (len = 12) => (
  Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map(x => letters[x % letters.length])
    .join('')
)

export async function initBasicWasm() {
  await init()
}

export function createWrapper() {
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
