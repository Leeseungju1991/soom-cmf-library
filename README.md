# 숨코리아 CMF Library (Firebase + React)

요구사항을 바탕으로 만든 웹앱 스캐폴드입니다.

## 제공 기능(요구사항 매핑)
- Dashboard(주/부 표기)
  - 자주 검색되는 항목 Top 5 (cmfSearchStats 기반)
  - 총 DB 개수 (Firestore count)
  - 마지막 수정/업데이트 날짜
  - 수정 이력 로그(최근 50건)
- 검색/필터
  - 필터 순서: color → 종류 → width
  - 검색 버튼을 눌러 결과 출력
- 결과 리스트 출력 항목
  - 무게/종류/업체명/No/comp/width/mount/cost/color/조직/전화번호/장소/아카이빙
  - 스와치: 이미지로 표시 + 클릭 시 확대
- 상세보기(수정 가능)
  - 상태, 최근 사용 프로젝트, 내부 활용도 평가, 샘플 위치 수정 가능
- 비교(2~4개)
  - 컬러 나란히 보기, cost/width/mount 비교
- CMF 추가하기
  - 입력 폼 + 스와치 업로드(Storage) + DB 저장
- 휴지통
  - 삭제 시 완전 삭제가 아니라 cmfTrash로 이동
  - 휴지통에서 복구 가능
- 로그인
  - id/pw: soom/soom (간단 세션 방식)

## 설치/실행
```bash
npm i
npm run dev
```

## Firebase 구축(권장 순서)
1. Firebase Console에서 프로젝트 확인 (요구사항 제공 프로젝트Id: appp-7e331)
2. Firestore Database 생성 (Native mode)
3. Storage 활성화
4. (선택) Hosting 설정 및 배포

### Firestore 컬렉션 구조
- cmfItems (활성 데이터)
- cmfTrash (삭제 데이터)
- cmfLogs (수정/검색/삭제/복구 로그)
- cmfSearchStats (검색 통계 Top5)

> 보안: 운영에서는 Firebase Auth + Security Rules 적용을 권장합니다.
