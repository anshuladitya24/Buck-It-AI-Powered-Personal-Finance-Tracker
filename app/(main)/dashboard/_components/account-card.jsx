"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="buck-it-card-soft hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold capitalize text-gray-800">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
            className="data-[state=checked]:bg-green-500"
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm font-medium">
          <div className="flex items-center text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            Income
          </div>
          <div className="flex items-center text-red-500">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
