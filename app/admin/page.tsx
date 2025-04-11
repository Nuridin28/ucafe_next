"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAdminDashboardStats } from "@/lib/api";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalMenuItems: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (error) {
        toast({
          title: t("admin.dashboard.error"),
          description: t("admin.dashboard.errorFetchingStats"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t, toast]);

  if (loading) {
    return <div className="flex justify-center p-8">{t("common.loading")}</div>;
  }

  if (!stats) {
    return <div>{t("admin.dashboard.noStats")}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("admin.dashboard.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.totalOrders")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.pendingOrders")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.totalRevenue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboard.menuItems")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMenuItems}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            {t("admin.dashboard.pendingOrders")}
          </TabsTrigger>
          <TabsTrigger value="stats">
            {t("admin.dashboard.statistics")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.dashboard.pendingOrders")}</CardTitle>
              <CardDescription>
                {t("admin.dashboard.pendingOrdersDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pending orders would be displayed here */}
              <p>{t("admin.dashboard.pendingOrdersPlaceholder")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.dashboard.statistics")}</CardTitle>
              <CardDescription>
                {t("admin.dashboard.statisticsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Statistics would be displayed here */}
              <p>{t("admin.dashboard.statisticsPl aceholder")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
