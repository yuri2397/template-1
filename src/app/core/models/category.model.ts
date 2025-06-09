export interface Category {
  id:       string;
  name:     string;
  slug:     string;
  icon_url: string;
  children: Category[];
  description?: string;
  collapsed: boolean;
  products_count?: number;
}
