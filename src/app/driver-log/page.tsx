import { Suspense } from "react";
import { DriverMobileLogView } from "@/features/driver-log/components/driver-mobile-log-view";

export const metadata = {
  title: "Driver Mobile Log | Nawasanga Fleet",
  description: "Form pencatatan konsumsi bahan bakar dan foto struk kasir terverifikasi untuk pengemudi armada.",
};

export default function DriverLogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6 text-sm text-[#7A7A72]">
        Memuat antarmuka driver log...
      </div>
    }>
      <DriverMobileLogView />
    </Suspense>
  );
}
