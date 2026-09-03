// Modelo central usado pelo catálogo, pelo CRUD e pelos relatórios.
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

// Critérios permitidos pela API para ordenar o catálogo.
export type ProductSort = "name" | "price" | "soldQuantity";
// Direção da ordenação solicitada pelo cliente.
export type SortOrder = "asc" | "desc";

// Parâmetros públicos de busca e ordenação.
export type ProductQuery = {
  code?: string;
  name?: string;
  sort?: ProductSort;
  order?: SortOrder;
};

// Payload aceito no cadastro e na edição; o servidor controla id e data.
export type ProductInput = Omit<Product, "id" | "updatedAt">;

// Resposta padronizada da busca, incluindo evidências do custo do QuickSort.
export type ProductSearchResult = {
  products: Product[];
  algorithm: string;
  complexity: string;
  executionTimeMs: number;
  comparisons: number;
  swaps: number;
};
