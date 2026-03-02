/**
 * CSV -> Firestore 초기 적재 스크립트 (cmfItems 컬렉션)
 * 사용법:
 *  1) Firebase 서비스 계정 키(JSON) 다운로드
 *  2) PowerShell:
 *     $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\serviceAccountKey.json"
 *  3) 실행:
 *     npm run import:csv -- "C:\path\숨코리아1.csv"
 *
 * 주의:
 * - Firestore는 undefined 값을 저장할 수 없습니다.
 * - 이 스크립트는 빈값은 아예 필드를 만들지 않도록 처리합니다.
 */
import fs from "node:fs";
import process from "node:process";
import { parse } from "csv-parse/sync";
import admin from "firebase-admin";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('CSV 경로를 입력하세요. 예: npm run import:csv -- "C:\\path\\cmf.csv"');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
// undefined 무시
db.settings({ ignoreUndefinedProperties: true });

const raw = fs.readFileSync(csvPath, "utf-8");
const records = parse(raw, { columns: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true, bom: true });

function pick(rec, keys) {
  for (const k of keys) {
    if (rec[k] !== undefined && rec[k] !== null && String(rec[k]).trim() !== "") return String(rec[k]).trim();
  }
  return undefined;
}

const mapped = records.map((r) => {
  const doc = {
    무게: pick(r, ["무게", "무게.", "weight", "mount"]), // CSV마다 컬럼명이 다를 수 있어 후보를 둡니다.
    종류: pick(r, ["종류", "kind"]),
    업체명: pick(r, ["업체명", "업체"]),
    No: pick(r, ["No.", "No", "번호"]),
    comp: pick(r, ["comp", "composition"]),
    width: pick(r, ["width", "폭"]),
    mount: pick(r, ["mount"]),
    cost: pick(r, ["cost(₩)", "cost", "가격"]),
    color: pick(r, ["color", "색상"]),
    colorCodes: (pick(r, ["color", "색상"]) ?? "").toString().includes("/")
      ? (pick(r, ["color", "색상"]) ?? "").toString().split("/").map(s=>s.trim()).filter(Boolean)
      : ((pick(r, ["color", "색상"]) ?? "").toString().trim() ? [(pick(r, ["color", "색상"]) ?? "").toString().trim()] : []),
    조직: pick(r, ["조직"]),
    전화번호: pick(r, ["전화번호", "연락처"]),
    장소: pick(r, ["장소", "위치"]),
    아카이빙: pick(r, ["아카이빙"]),
    // 상세 필드 기본값
    useStatus: "미사용",
    useIn: "",
    gender: "",
    releaseYear: "",
    collectionName: "",
    sampleLocation: "",
    outfits: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // 빈 문자열은 제거(선택)
  for (const k of Object.keys(doc)) {
    if (doc[k] === "") delete doc[k];
  }
  return doc;
});

console.log("records:", mapped.length);

const batchSize = 400;
for (let i = 0; i < mapped.length; i += batchSize) {
  const chunk = mapped.slice(i, i + batchSize);
  const batch = db.batch();
  for (const row of chunk) {
    const ref = db.collection("cmfItems").doc(); // 자동 ID
    batch.set(ref, row);
  }
  await batch.commit();
  console.log(`Imported ${Math.min(i + batchSize, mapped.length)} / ${mapped.length}`);
}

// 필터 메타(읽기 최적화용) 업데이트: cmfMeta/filters
const weights = Array.from(new Set(mapped.map(x => (x.무게 ?? "").toString().trim()).filter(Boolean))).sort();
const comps = Array.from(new Set(mapped.map(x => (x.comp ?? "").toString().trim()).filter(Boolean))).sort();
await db.collection("cmfMeta").doc("filters").set({ weights, comps, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

console.log("Done");
