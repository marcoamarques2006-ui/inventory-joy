import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Package, Pencil, Trash2, Filter, Search, ArrowUpDown, X, Save } from "lucide-react";
import { products as initialProducts, brl, type Product } from "@/lib/stock-data";
import type { ProductInput } from "@/domain/product";
import { StockBadge } from "@/components/stock-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — StockFlow" },
      { name: "description", content: "Catálogo completo de produtos com níveis de estoque, custos e fornecedores." },
      { property: "og:title", content: "Produtos — StockFlow" },
      { property: "og:description", content: "Catálogo completo de produtos com níveis de estoque, custos e fornecedores." },
    ],
  }),
  component: Produtos,
});

const filters = ["Todos", "Em dia", "Baixo", "Crítico"] as const;
const emptyProduct: ProductInput = { sku: "", name: "", category: "Periféricos", stock: 0, minStock: 1, cost: 0, price: 0, soldQuantity: 0, supplier: "" };

function Produtos() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "code">("name");
  const [sort, setSort] = useState<"name" | "price" | "soldQuantity">("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchInfo, setSearchInfo] = useState("");
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ sort, order });
    if (query.trim()) params.set(searchType, query.trim());

    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((result: { products: Product[]; executionTimeMs: number; comparisons: number; swaps: number; algorithm: string }) => {
        setProducts(result.products);
        setSearchInfo(`${result.algorithm} · ${result.executionTimeMs} ms · ${result.comparisons} comparações · ${result.swaps} trocas`);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSearchInfo("Não foi possível consultar a API");
      });

    return () => controller.abort();
  }, [query, searchType, sort, order]);

  const list = useMemo(() => {
    return products.filter((p) => {
      const status = p.stock < p.minStock * 0.5 ? "Crítico" : p.stock < p.minStock ? "Baixo" : "Em dia";
      return filter === "Todos" || status === filter;
    });
  }, [products, filter]);

  function openCreateForm() {
    setEditingId(null);
    setShowForm(true);
    setForm(emptyProduct);
    setFormError("");
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);
    setShowForm(true);
    const { id: _id, updatedAt: _updatedAt, ...input } = product;
    setForm(input);
    setFormError("");
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      const error = await response.json() as { message?: string };
      setFormError(error.message ?? "Não foi possível salvar o produto.");
      return;
    }
    setEditingId(null);
    setShowForm(false);
    setForm(emptyProduct);
    setQuery("");
    window.location.reload();
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Excluir ${product.name}?`)) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{initialProducts.length} produtos cadastrados · {list.length} exibidos · {searchInfo}</p>
        </div>
        <button onClick={openCreateForm} className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Package className="h-4 w-4" /> Cadastrar produto
        </button>
      </div>

      {showForm && (
        <ProductForm form={form} setForm={setForm} error={formError} editing={editingId !== null} onSubmit={saveProduct} onCancel={() => { setEditingId(null); setShowForm(false); setFormError(""); }} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="ml-2 h-4 w-4" />
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm text-foreground outline-none">
            <option value="name">Nome</option>
            <option value="price">Preço</option>
            <option value="soldQuantity">Mais vendidos</option>
          </select>
          <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")} className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted" aria-label={`Ordenação ${order === "asc" ? "crescente" : "decrescente"}`}>
            {order === "asc" ? "A-Z / menor" : "Z-A / maior"}
          </button>
        </div>
        <div className="ml-auto flex w-full min-w-0 sm:w-auto">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value as "name" | "code")} className="rounded-l-lg border border-r-0 border-input bg-card px-2 py-1.5 text-sm outline-none">
            <option value="name">Nome</option>
            <option value="code">Código</option>
          </select>
          <div className="relative flex min-w-0 flex-1 items-center sm:w-64">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Buscar por ${searchType === "name" ? "nome" : "código"}...`} className="w-full rounded-r-lg border border-input bg-card py-1.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5">Produto</th>
                <th className="px-5 py-3.5">Categoria</th>
                <th className="px-5 py-3.5 text-right">Estoque</th>
                <th className="px-5 py-3.5 text-right">Custo</th>
                <th className="px-5 py-3.5 text-right">Preço</th>
                <th className="px-5 py-3.5 text-right">Vendidos</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Fornecedor</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-semibold tabular-nums">{p.stock}</span>
                    <span className="text-xs text-muted-foreground"> / mín. {p.minStock}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">{brl(p.cost)}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">{brl(p.price)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{p.soldQuantity}</td>
                  <td className="px-5 py-3.5"><StockBadge product={p} /></td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.supplier}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEditForm(p)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteProduct(p)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">
                    Nenhum produto encontrado para esse filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ form, setForm, error, editing, onSubmit, onCancel }: { form: ProductInput; setForm: React.Dispatch<React.SetStateAction<ProductInput>>; error: string; editing: boolean; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  const update = (field: keyof ProductInput, value: string) => setForm((current) => ({ ...current, [field]: ["stock", "minStock", "cost", "price", "soldQuantity"].includes(field) ? Number(value) : value }));
  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{editing ? "Editar produto" : "Novo produto"}</h2><button type="button" onClick={onCancel} aria-label="Fechar formulário"><X className="h-4 w-4" /></button></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(["sku", "name", "category", "supplier"] as const).map((field) => <label key={field} className="text-xs font-medium text-muted-foreground">{field === "sku" ? "Código" : field === "name" ? "Nome" : field === "category" ? "Categoria" : "Fornecedor"}<input required value={form[field]} onChange={(event) => update(field, event.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none" /></label>)}
        {(["stock", "minStock", "cost", "price", "soldQuantity"] as const).map((field) => <label key={field} className="text-xs font-medium text-muted-foreground">{field === "soldQuantity" ? "Vendidos" : field === "minStock" ? "Estoque mínimo" : field === "stock" ? "Estoque" : field === "cost" ? "Custo" : "Preço"}<input required min="0" type="number" step="0.01" value={form[field]} onChange={(event) => update(field, event.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none" /></label>)}
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground"><Save className="h-4 w-4" /> Salvar produto</button>
    </form>
  );
}
