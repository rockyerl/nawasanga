import { Suspense } from "react";
import KYCPage from "@/components/landing/kyc";

export default function Page() {
  return (
    <Suspense>
      <KYCPage />
    </Suspense>
  );
}
