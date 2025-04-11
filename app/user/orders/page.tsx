"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getUserOrders } from "@/lib/api";
import { Order } from "@/types/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        toast({
          title: t("orders.error"),
          description: t("orders.errorFetchingOrders"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t, toast]);

  if (loading) {
    return <div className="flex justify-center p-8">{t("common.loading")}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("orders.title")}</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                {t("orders.noOrders")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("orders.title")}</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {t("orders.orderNumber", { number: order.orderNumber })}
                </CardTitle>
                {/* @ts-ignore */}
                <Badge variant={getStatusVariant(order.status)}>
                  {t(`orders.status.${order.status}`)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity} × {item.food.name}
                    </span>
                    <span>${(item.food.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <Separator className="my-2" />

                <div className="flex justify-between font-medium">
                  <span>{t("orders.total")}</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "pending":
      return "default";
    case "preparing":
      return "secondary";
    case "ready":
      return "success";
    case "completed":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}
