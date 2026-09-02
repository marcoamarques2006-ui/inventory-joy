import { cn } from "@/lib/utils";
import type { Product } from "@/lib/stock-data";
import { stockStatus } from "@/lib/stock-data";

const styles = {
  ok: "bg-success/10 text-success",
  baixo: "bg-warning/15 text-warning-foreground",
  critico: "bg-destructive/10 text-destructive",
};

const labels = { ok: "Em dia", baixo: "Baixo", critico: "Crítico" };

export function StockBadge({ product }: { product: Product }) {
  const status = stockStatus(product);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
