import React from "react";
import { Package } from "lucide-react";
import type { Order } from "@/modules/orders/types";

export const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="card order-card flex flex-col md:flex-row justify-between gap-x-3 gap-y-6 text-xs border-b last:border-b-0 py-5">
      <div className="col flex items-center gap-5">
        <div className="bg-secondary-v4/10 p-2 rounded-sm self-start">
          <Package className="h-10 w-10 text-secondary-v3" />
        </div>
        <div>
          <ul className="mb-2">
            {order.items.map((item, index) => {
              return (
                <li key={index} className="flex items-center gap-2">
                  <span className="truncate max-w-40">{item.name}</span>
                  <span>× {item.quantity}</span>
                </li>
              );
            })}
          </ul>
          <div className="text-secondary-v4">4 items</div>
        </div>
      </div>

      <div className="col">
        <div className="max-w-30 line-camp-4">123 Main St New York, NY 1234567890</div>
      </div>

      <div className="col md:self-center">
        <div className="font-medium">$2344.98</div>
      </div>

      <div className="col">
        <div className="mb-2">May 20, 2026</div>
        <div className="bg-yellow-50 text-center rounded-sm py-1 px-2 border border-black/4 inline-block">Pending</div>
      </div>
    </div>
  );
};
