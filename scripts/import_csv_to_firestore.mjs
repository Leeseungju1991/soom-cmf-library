/**
 * CSV -> Firestore 초기 적재 스크립트
 * 사용법:
 *  1) firebase-admin 서비스 계정 키(JSON) 다운로드 후, 경로를 GOOGLE_APPLICATION_CREDENTIALS로 설정
 *  2) node scripts/import_csv_to_firestore.mjs /path/to/cmf.csv
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "csv-parse/sync";
import admin from "firebase-admin";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("CSV 경로를 입력하세요. 예: node scripts/import_csv_to_firestore.mjs data.csv");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

const raw = fs.readFileSync(csvPath, "utf-8");
const records = parse(raw, { columns: true, skip_empty_lines: true });

function pick(rec, keys) {
  for (const k of keys) {
    if (rec[k] !== undefined && rec[k] !== null && String(rec[k]).trim() !== "") return String(rec[k]).trim();
  }
  return undefined;
}

// CSV 컬럼명이 파일마다 달라서(예: "No." vs "No") 여러 후보를 둡니다.
const mapped = records.map((r) => ({
  무게: pick(r, ["무게", "무게.", "무게 (1)", "mount"]), // 상황에 맞게 조정
  종류: pick(r, ["종류", "종류.", "kind"]),
  업체명: pick(r, ["업체명", "업체"]),
  No: pick(r, ["No.", "No", "번호"]),
  comp: pick(r, ["comp", "composition"]),
  width: pick(r, ["width", "폭"]),
  mount: pick(r, ["mount"]),
  cost: pick(r, ["cost(₩)", "cost", "가격"]),
  color: pick(r, ["color", "색상"]),
  조직: pick(r, ["조직"]),
  전화번호: pick(r, ["전화번호", "연락처"]),
  장소: pick(r, ["장소", "위치"]),
  아카이빙: pick(r, ["아카이빙"]),
  // 스와치는 이미지 파일명만 들어있을 수 있음(스토리지 업로드 후 swatchUrl 채우기 권장)
  swatchFileName: pick(r, ["스와치"]),
  createdAt: Date.now(),
  updatedAt: Date.now(),
}));

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

console.log("Done");
