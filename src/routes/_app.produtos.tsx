import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Package, Pencil, Trash2, Filter } from "lucide-react";
import { products, brl } from "@/lib/stock-data";
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

function Produtos() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");

  const list = useMemo(() => {
    return products.filter((p) => {
      const q = query.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q);
      const status = p.stock < p.minStock * 0.5 ? "Crítico" : p.stock < p.minStock ? "Baixo" : "Em dia";
      return matchQ && (filter === "Todos" || status === filter);
    });
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} produtos cadastrados</p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Package className="h-4 w-4" /> Cadastrar produto
        </button>
      </div>

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
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar por nome, SKU ou fornecedor..."
          className="ml-auto w-full min-w-0 rounded-lg border border-input bg-card px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground sm:w-64"
        />
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
                  <td className="px-5 py-3.5"><StockBadge product={p} /></td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.supplier}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
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
