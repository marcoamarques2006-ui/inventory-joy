import type { Product, ProductInput, ProductQuery, ProductSearchResult } from "@/domain/product";
import type { ProductRepository } from "./product-repository";
import { binarySearchByCode, sortProductsWithMetrics } from "./product-algorithms";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  search(query: ProductQuery): ProductSearchResult {
    // O serviço coordena busca, ordenação e métricas sem conhecer detalhes HTTP.
    const startedAt = performance.now();
    const allProducts = this.repository.findAll();
    let result = query.code ? binarySearchByCode(allProducts, query.code) : allProducts;

    if (query.name) {
      const normalizedName = query.name.trim().toLocaleLowerCase("pt-BR");
      result = result.filter((product) => product.name.toLocaleLowerCase("pt-BR").includes(normalizedName));
    }

    const sort = query.sort ?? "name";
    const order = query.order ?? "asc";
    const sortedResult = sortProductsWithMetrics(result, sort, order);
    result = sortedResult.items;

    return {
      products: result,
      algorithm: query.code ? "Busca binária + QuickSort" : "QuickSort",
      complexity: query.code ? "O(log n) na busca e O(n log n) na ordenação" : "O(n log n) médio; O(n²) no pior caso",
      executionTimeMs: Number((performance.now() - startedAt).toFixed(3)),
      comparisons: sortedResult.comparisons,
      swaps: sortedResult.swaps,
    };
  }

  create(input: ProductInput): Product {
    // SKU é a identidade funcional do produto e não pode se repetir.
    this.validate(input);
    if (this.repository.findAll().some((product) => product.sku.toLowerCase() === input.sku.toLowerCase())) {
      throw new Error("Já existe um produto com este código.");
    }
    return this.repository.create({ ...input, id: crypto.randomUUID(), updatedAt: new Date().toLocaleDateString("pt-BR") });
  }

  update(id: string, input: ProductInput): Product {
    this.validate(input);
    const current = this.repository.findAll().find((product) => product.id === id);
    if (!current) throw new Error("Produto não encontrado.");
    if (this.repository.findAll().some((product) => product.id !== id && product.sku.toLowerCase() === input.sku.toLowerCase())) {
      throw new Error("Já existe um produto com este código.");
    }
    return this.repository.update(id, { ...input, id, updatedAt: new Date().toLocaleDateString("pt-BR") })!;
  }

  delete(id: string): void {
    if (!this.repository.delete(id)) throw new Error("Produto não encontrado.");
  }

  private validate(input: ProductInput): void {
    // A validação fica centralizada para ser reutilizada por POST e PUT.
    if (!input.sku.trim() || !input.name.trim() || !input.category.trim()) throw new Error("Código, nome e categoria são obrigatórios.");
    if (input.price < 0 || input.cost < 0 || input.stock < 0 || input.minStock < 0 || input.soldQuantity < 0) throw new Error("Valores numéricos não podem ser negativos.");
  }
}
