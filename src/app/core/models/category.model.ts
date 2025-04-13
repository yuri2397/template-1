export interface Category {
  id:       string;
  name:     string;
  slug:     string;
  icon_url: string;
  children: Category[];
  
  collapsed: boolean;
}