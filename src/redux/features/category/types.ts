export interface MainCategoryItem {
  id: number;
  name: string,
  created_by: 0,
}
export interface SubCategoryItem {
  id: number;
  name: string,
  main_category: string,
  created_by: 0,
}

export interface CategoryItem {
  id: number;
  name: string;
  parent: number | null;
  created_at: string;
  updated_at: string
  children: CategoryItem[]
}

