# CSV 초기 적재 스크립트

이 프로젝트는 기본적으로 Firestore를 DB로 사용합니다.

## 1) 준비
- Firebase Console → Project Settings → Service accounts → 새 비공개 키(JSON) 다운로드
- 환경변수 설정:
  - macOS/Linux:
    - export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
  - Windows(PowerShell):
    - setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\serviceAccountKey.json"

## 2) 실행
```bash
npm i -D firebase-admin csv-parse
node scripts/import_csv_to_firestore.mjs "/path/to/[숨코리아] CMF LIBRARY ..._all.csv"
```

## 3) 스와치 이미지
CSV의 '스와치' 컬럼에 파일명만 있는 경우가 많습니다.
- 가장 쉬운 방법: 웹에서 각 항목 상세/추가 시 스와치 업로드 → `swatchUrl` 저장
- 대량 업로드가 필요하면 Storage에 업로드 후, 해당 doc의 `swatchUrl` 업데이트 스크립트를 추가하세요.
