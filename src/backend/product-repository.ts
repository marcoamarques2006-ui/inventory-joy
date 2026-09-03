import { products } from "@/lib/stock-data";
import type { Product } from "@/domain/product";

export interface ProductRepository {
  findAll(): Product[];
  create(product: Product): Product;
  update(id: string, product: Product): Product | undefined;
  delete(id: string): boolean;
}

export class InMemoryProductRepository implements ProductRepository {
  private readonly items: Product[] = [...products];

  findAll(): Product[] {
    return [...this.items];
  }

  create(product: Product): Product {
    this.items.push(product);
    return product;
  }

  update(id: string, product: Product): Product | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.items[index] = product;
    return product;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
