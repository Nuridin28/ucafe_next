"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { getAllFood, deleteFood } from "@/lib/api";
import { FoodItem } from "@/types/food";

export default function MenuPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await getAllFood();
        setFoods(data);
        setFilteredFoods(data);
      } catch (error) {
        toast({
          title: t("admin.menu.error"),
          description: t("admin.menu.errorFetchingMenu"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [t, toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFoods(foods);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredFoods(
        foods.filter(
          (food) =>
            food.name.toLowerCase().includes(query) ||
            food.description.toLowerCase().includes(query) ||
            food.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, foods]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("admin.menu.confirmDelete"))) {
      try {
        await deleteFood(id);
        setFoods(foods.filter((food) => food.id !== id));
        toast({
          title: t("admin.menu.success"),
          description: t("admin.menu.itemDeleted"),
        });
      } catch (error) {
        toast({
          title: t("admin.menu.error"),
          description: t("admin.menu.errorDeletingItem"),
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("admin.menu.title")}</h1>
        <Button asChild>
          <Link href="/admin/menu/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("admin.menu.addItem")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.menu.manageItems")}</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input
              placeholder={t("admin.menu.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            <Button variant="outline" size="sm" className="h-9 px-3">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFoods.length === 0 ? (
            <p className="text-center py-4">{t("admin.menu.noItems")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.menu.name")}</TableHead>
                  <TableHead>{t("admin.menu.price")}</TableHead>
                  <TableHead>{t("admin.menu.category")}</TableHead>
                  <TableHead>{t("admin.menu.quantity")}</TableHead>
                  <TableHead className="text-right">
                    {t("admin.menu.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoods.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell className="font-medium">{food.name}</TableCell>
                    <TableCell>${food.price.toFixed(2)}</TableCell>
                    <TableCell>{food.category}</TableCell>
                    <TableCell>{food.quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/menu/edit/${food.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(food.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
