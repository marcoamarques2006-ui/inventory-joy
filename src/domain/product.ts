export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  cost: number;
  price: number;
  soldQuantity: number;
  supplier: string;
  updatedAt: string;
};

export type ProductSort = "name" | "price" | "soldQuantity";
export type SortOrder = "asc" | "desc";

export type ProductQuery = {
  code?: string;
  name?: string;
  sort?: ProductSort;
  order?: SortOrder;
};

export type ProductInput = Omit<Product, "id" | "updatedAt">;

export type ProductSearchResult = {
  products: Product[];
  algorithm: string;
  complexity: string;
  executionTimeMs: number;
  comparisons: number;
  swaps: number;
};
