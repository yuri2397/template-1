export interface Category {
  id:             string;
  name:           string;
  slug:           string;
  description:    string;
  is_active:      boolean;
  parent_id:      null;
  products_count: number;
  icon_url:       string;
  created_at:     Date;
  updated_at:     Date;
}