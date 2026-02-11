export type CmfStatus = "사용중" | "검토중" | "단종" | "보류";

export type CmfItem = {
  id: string; // Firestore doc id
  // 기본 데이터(검색 결과 표시)
  무게?: string;
  종류?: string;
  업체명?: string;
  No?: string;
  comp?: string;
  width?: string;
  mount?: string;
  cost?: string;
  color?: string;
  조직?: string;
  전화번호?: string;
  장소?: string;
  아카이빙?: string;
  swatchUrl?: string; // Storage 다운로드 URL

  // 상세보기에서 수정 가능한 필드
  status?: CmfStatus;
  recentProject?: string;
  usageScore?: string; // 내부 활용도 평가(텍스트/점수 자유)
  sampleLocation?: string; // 샘플 위치(실물 보관 위치)

  // 메타
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
};
