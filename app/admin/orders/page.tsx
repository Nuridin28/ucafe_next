"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search } from "lucide-react"
import { getAllOrders, updateOrderStatus, type Order } from "@/lib/api"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders()
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        toast({
          title: t("admin.orders.error"),
          description: t("admin.orders.errorFetchingOrders"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [t, toast])

  useEffect(() => {
    let filtered = orders

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.user.name.toLowerCase().includes(query) ||
          order.user.email.toLowerCase().includes(query),
      )
    }

    setFilteredOrders(filtered)
  }, [searchQuery, statusFilter, orders])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      toast({
        title: t("admin.orders.success"),
        description: t("admin.orders.statusUpdated"),
      })
    } catch (error) {
      toast({
        title: t("admin.orders.error"),
        description: t("admin.orders.errorUpdatingStatus"),
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">{t("common.loading")}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("admin.orders.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.orders.manageOrders")}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder={t("admin.orders.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
              <Button variant="outline" size="sm" className="h-9 px-3">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("admin.orders.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.orders.allOrders")}</SelectItem>
                <SelectItem value="pending">{t("admin.orders.pending")}</SelectItem>
                <SelectItem value="preparing">{t("admin.orders.preparing")}</SelectItem>
                <SelectItem value="ready">{t("admin.orders.ready")}</SelectItem>
                <SelectItem value="completed">{t("admin.orders.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("admin.orders.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-center py-4">{t("admin.orders.noOrders")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.orders.orderNumber")}</TableHead>
                  <TableHead>{t("admin.orders.customer")}</TableHead>
                  <TableHead>{t("admin.orders.date")}</TableHead>
                  <TableHead>{t("admin.orders.total")}</TableHead>
                  <TableHead>{t("admin.orders.status")}</TableHead>
                  <TableHead>{t("admin.orders.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{t(`admin.orders.${order.status}`)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                        disabled={order.status === "completed" || order.status === "cancelled"}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder={t("admin.orders.updateStatus")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{t("admin.orders.pending")}</SelectItem>
                          <SelectItem value="preparing">{t("admin.orders.preparing")}</SelectItem>
                          <SelectItem value="ready">{t("admin.orders.ready")}</SelectItem>
                          <SelectItem value="completed">{t("admin.orders.completed")}</SelectItem>
                          <SelectItem value="cancelled">{t("admin.orders.cancelled")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "pending":
      return "default"
    case "preparing":
      return "secondary"
    case "ready":
      return "success"
    case "completed":
      return "outline"
    case "cancelled":
      return "destructive"
    default:
      return "default"
  }
}
