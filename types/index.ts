export type KatsuoType = "初カツオ" | "戻りカツオ" | "その他";

export interface KatsuoRecord {
  id: string;
  date: string;
  katsuo_type: KatsuoType;
  dish: string;
  weight_g: number | null;
  location: string;
  rating: number;        // 1–5
  memo: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  totalRecords: number;
  totalWeightG: number;
  thisYearWeightG: number;
  thisYearCount: number;
  avgRating: number;
  avgWeightG: number;
  topLocation: string;
}
