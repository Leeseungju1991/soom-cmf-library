export type UseStatus = "사용중" | "미사용";
export type UseIn = "" | "THE GEM" | "IDEALIAN" | "NEOR" | "ICONIA";
export type Gender = "" | "남아" | "여아";

export type OutfitPhoto = {
  photoUrl: string;
  characterName: string;
  itemLabel: string;
};

export type CmfItem = {
  id: string;

  // CSV 기본 필드
  무게?: string;
  업체명?: string;
  No?: string;
  comp?: string;
  width?: string;
  mount?: string;
  cost?: string;
  color?: string;
  colorCodes?: string[];
  조직?: string;
  전화번호?: string;
  장소?: string;
  아카이빙?: string;

  // 상세 편집 필드(요구사항 5)
  useStatus?: UseStatus;
  useIn?: UseIn;
  gender?: Gender;
  releaseYear?: string;
  collectionName?: string;
  sampleLocation?: string;
  outfits?: OutfitPhoto[];

  createdAt?: any;
  updatedAt?: any;
};
