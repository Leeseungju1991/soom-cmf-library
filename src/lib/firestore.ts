import { 
  collection, doc, getDoc, getDocs, query, where, orderBy, limit,
  addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp,
  getCountFromServer, startAfter
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import type { CmfItem } from "./types";

export const COL = {
  items: "cmfItems",
  trash: "cmfTrash",
  logs: "cmfLogs",
  search: "cmfSearchStats"
} as const;

export async function getTotalCount() {
  const snap = await getCountFromServer(collection(db, COL.items));
  return snap.data().count;
}

export async function getLastUpdated() {
  const q = query(collection(db, COL.items), orderBy("updatedAt", "desc"), limit(1));
  const snap = await getDocs(q);
  const d = snap.docs[0]?.data() as any;
  return d?.updatedAt as number | undefined;
}

export async function getTopSearches() {
  const q = query(collection(db, COL.search), orderBy("count", "desc"), limit(5));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Array<{id:string, count:number, label:string}>;
}

export async function log(action: string, payload: any) {
  await addDoc(collection(db, COL.logs), {
    action,
    payload,
    at: Date.now(),
  });
}

export async function searchItems(filters: { color?: string; 종류?: string; width?: string; }) {
  const conds: any[] = [];
  if (filters.color) conds.push(where("color", "==", filters.color));
  if (filters.종류) conds.push(where("종류", "==", filters.종류));
  if (filters.width) conds.push(where("width", "==", filters.width));

  const q = query(collection(db, COL.items), ...conds, orderBy("updatedAt", "desc"), limit(200));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as CmfItem[];

  // 검색 통계 누적
  const label = `color=${filters.color ?? "-"}, 종류=${filters.종류 ?? "-"}, width=${filters.width ?? "-"}`;
  const key = btoa(unescape(encodeURIComponent(label))).replace(/=+$/,"");
  const statRef = doc(db, COL.search, key);
  const stat = await getDoc(statRef);
  if (stat.exists()) {
    await updateDoc(statRef, { count: (stat.data() as any).count + 1, label, updatedAt: Date.now() });
  } else {
    await setDoc(statRef, { count: 1, label, createdAt: Date.now(), updatedAt: Date.now() });
  }
  await log("search", { filters });

  return items;
}

export async function getItem(id: string) {
  const snap = await getDoc(doc(db, COL.items, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as CmfItem;
}

export async function updateItem(id: string, patch: Partial<CmfItem>) {
  await updateDoc(doc(db, COL.items, id), { ...patch, updatedAt: Date.now() });
  await log("update", { id, patch });
}

export async function addItem(data: Omit<CmfItem, "id">, swatchFile?: File) {
  const now = Date.now();
  const docRef = await addDoc(collection(db, COL.items), { ...data, createdAt: now, updatedAt: now });
  let swatchUrl: string | undefined;

  if (swatchFile) {
    const storageRef = ref(storage, `swatches/${docRef.id}/${swatchFile.name}`);
    await uploadBytes(storageRef, swatchFile);
    swatchUrl = await getDownloadURL(storageRef);
    await updateDoc(docRef, { swatchUrl, updatedAt: Date.now() });
  }

  await log("create", { id: docRef.id });
  return { id: docRef.id, swatchUrl };
}

export async function softDelete(id: string) {
  const item = await getItem(id);
  if (!item) return;
  const trashRef = doc(db, COL.trash, id);
  await setDoc(trashRef, { ...item, deletedAt: Date.now() });
  await deleteDoc(doc(db, COL.items, id));
  await log("delete_to_trash", { id });
}

export async function restoreFromTrash(id: string) {
  const snap = await getDoc(doc(db, COL.trash, id));
  if (!snap.exists()) return;
  const data = snap.data() as any;
  const { deletedAt, ...rest } = data;
  await setDoc(doc(db, COL.items, id), { ...rest, updatedAt: Date.now() });
  await deleteDoc(doc(db, COL.trash, id));
  await log("restore", { id });
}

export async function listTrash() {
  const q = query(collection(db, COL.trash), orderBy("deletedAt", "desc"), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as CmfItem[];
}

export async function listLogs() {
  const q = query(collection(db, COL.logs), orderBy("at", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any[];
}
