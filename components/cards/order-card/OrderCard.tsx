import React from "react";
import { Package } from "lucide-react";
import type { Order, OrderApi } from "@/modules/orders/types";
import { formatFirestoreDate } from "@/lib/utils/formatters";

export const OrderCard = ({ order, className='' }: { order: OrderApi, className?: string }) => {
  const shippingAddress = order.shippingAddress || order?.stripe?.shippingAddress
  return (
    <div className={` ${className} card order-card flex flex-col lg:flex-row justify-between gap-x-3 gap-y-6 text-xs border-b last:border-b-0 py-5 min-h-25`}>
      <div className="col flex-1 max-w-fit flex items-center gap-5 ">
        <div className="bg-secondary-v4/10 p-2 rounded-sm self-start">
          <Package className="h-10 w-10 text-secondary-v3" />
        </div>
        <div>
          <ul className="mb-3">
            {order.items.map((item, index) => {
              return (
                <li key={index} className="flex items-center gap-1 mb-1 max-w-45">
                  <span className="truncate " title={item.productDetails.title}>{item.productDetails.title}</span>×
                  <span className=''> {item.quantity}</span>
                </li>
              );
            })}
          </ul>
          <div className="text-secondary-v4">
            {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
          </div>
        </div>
      </div>

      <div className="col flex-1 max-w-[200px]  ">
        <div className="max-w-40 line-camp-4">
          {[
            shippingAddress?.streetAddress,
            shippingAddress?.country,
            shippingAddress?.city,
            shippingAddress?.state,
            shippingAddress?.postalCode,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      </div>

      <div className="col flex-1 max-w-[30px]  lg:self-center">
        <div className="font-medium">${order.amount}</div>
      </div>

      <div className="col ">
        <div className="mb-2">{formatFirestoreDate(order.createdAt)}</div>
        <div
          className={`${order.status === "paid" ? "bg-green-50" : "bg-yellow-50"} text-center rounded-sm py-1 px-2 border border-black/4 inline-block uppercase`}
        >
          {order.status}
        </div>
      </div>
    </div>
  );
};
