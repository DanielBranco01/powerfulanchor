import { STOCK_META, type StockKey } from "@/lib/catalogue";

export default function StockBadge({ stock }: { stock: StockKey }) {
  const meta = STOCK_META[stock] ?? STOCK_META.order;
  return (
    <span className={`stock ${meta.cls}`}>
      <span className="dot" />
      {meta.label}
    </span>
  );
}
