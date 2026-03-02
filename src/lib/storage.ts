import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import type { OutfitPhoto } from "./types";

export async function uploadOutfitPhoto(opts: { itemId: string; file: File }): Promise<OutfitPhoto> {
  const { itemId, file } = opts;

  const safeName = file.name.replace(/\s+/g, "_");
  const path = `cmf/${itemId}/outfit/${Date.now()}_${safeName}`;
  const r = ref(storage, path);

  await uploadBytes(r, file);
  const url = await getDownloadURL(r);

  return { url, name: file.name, path, createdAt: Date.now() };
}