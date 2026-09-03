import type { Product, ProductSort, SortOrder } from "@/domain/product";

export type QuickSortResult<T> = {
  items: T[];
  comparisons: number;
  swaps: number;
};

// QuickSort in-place sobre uma cópia: preserva os dados originais e contabiliza o custo da ordenação.
export function quickSort<T>(items: T[], compare: (first: T, second: T) => number): QuickSortResult<T> {
  const sorted = [...items];
  let comparisons = 0;
  let swaps = 0;

  function partition(left: number, right: number): number {
    // O último elemento é o pivô; ao final, ele ocupa sua posição definitiva.
    const pivot = sorted[right];
    let boundary = left;
    for (let index = left; index < right; index += 1) {
      comparisons += 1;
      if (compare(sorted[index], pivot) <= 0) {
        if (boundary !== index) {
          // Itens menores ou iguais ao pivô ficam antes da fronteira.
          [sorted[boundary], sorted[index]] = [sorted[index], sorted[boundary]];
          swaps += 1;
        }
        boundary += 1;
      }
    }
    if (boundary !== right) {
      [sorted[boundary], sorted[right]] = [sorted[right], sorted[boundary]];
      swaps += 1;
    }
    return boundary;
  }

  function sort(left: number, right: number): void {
    if (left >= right) return;
    // Divide o intervalo e ordena recursivamente as duas partições.
    const pivotIndex = partition(left, right);
    sort(left, pivotIndex - 1);
    sort(pivotIndex + 1, right);
  }

  sort(0, sorted.length - 1);
  return { items: sorted, comparisons, swaps };
}

function compareByName(first: Product, second: Product): number {
  return first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" });
}

export function binarySearchByCode(items: Product[], code: string): Product[] {
  // A busca binária exige uma coleção ordenada; o próprio QuickSort prepara essa cópia.
  const productsByCode = quickSort(items, (first, second) => first.sku.localeCompare(second.sku)).items;
  let left = 0;
  let right = productsByCode.length - 1;
  const normalizedCode = code.trim().toLowerCase();

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const current = productsByCode[middle].sku.toLowerCase();
    // Cada comparação descarta metade do intervalo restante.
    if (current === normalizedCode) return [productsByCode[middle]];
    if (current < normalizedCode) left = middle + 1;
    else right = middle - 1;
  }
  return [];
}

export function sortProducts(items: Product[], sort: ProductSort, order: SortOrder): Product[] {
  return sortProductsWithMetrics(items, sort, order).items;
}

export function sortProductsWithMetrics(items: Product[], sort: ProductSort, order: SortOrder): QuickSortResult<Product> {
  const compare = sort === "name"
    ? compareByName
    : (first: Product, second: Product) => (sort === "price" ? first.price - second.price : first.soldQuantity - second.soldQuantity);
  const multiplier = order === "asc" ? 1 : -1;
  return quickSort(items, (first, second) => multiplier * compare(first, second));
}
