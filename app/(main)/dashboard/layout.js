import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tight gradient-title mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Take control of your financial future
          </p>
        </div>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#34A853" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}
