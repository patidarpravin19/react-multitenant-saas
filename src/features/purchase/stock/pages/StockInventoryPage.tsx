import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";
import { createResourceApi } from "../../../shared/resourceApi";
import { stockColumns } from "../config/stock.columns";
import type { StockItem } from "../types/stock.types";

const stockApi = createResourceApi<StockItem>("/inventory/stock");

export function StockInventoryPage() {
  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Stock Inventory</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review on-hand quantities and sold products. Sales reduce stock; deleting a sale returns its item to inventory.
        </p>
      </header>
      <DynamicGrid
        title="Stock Inventory"
        columns={stockColumns}
        mode="server"
        serverSource={stockApi.serverSource}
        getRowId={(item) => item.id}
        selectable={false}
        emptyMessage="No inventory products are available."
      />
    </section>
  );
}
