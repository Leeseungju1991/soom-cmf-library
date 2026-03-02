# 숨코리아 CMF Library (v2)

- 제목: **숨코리아 CMF Library**
- 로그인: **soom / soom**
- 스와치: **무조건 고정 이미지** (DB swatchUrl 무시)

## 1) 로컬 실행
```bash
npm install
npm run dev
```

## 2) Firestore CSV 업로드(초기 적재)
1. Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성(JSON 다운로드)
2. PowerShell(Windows):
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\serviceAccountKey.json"
```
3. 실행:
```powershell
npm run import:csv -- "C:\path\숨코리아1.csv"
```

## 3) Firebase Hosting 배포
```bash
npm run build
firebase deploy
```

## 주요 기능
- Dashboard: 총 DB 개수, 마지막 업데이트, Top5 검색, 로그
- 검색/필터: **무게 → 종류 → comp → color** (DB 기반 하위 필터)
- 결과 목록: 요구 항목 표기 + 스와치 확대 보기
- 상세보기: 사용여부/사용 프로젝트/성별/출시년도/콜렉션명/샘플위치/의상사진(URL) 수정
- 비교: 2~4개 선택 후 color/cost/width/mount 비교
- 휴지통: 삭제 시 이동, 복구/완전삭제 가능
