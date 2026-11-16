import InternalDashboard from "@/features/dashboard/components/internal-dashboard";

export const metadata = {
  title: "Super Admin Dashboard | Nawasanga Carbon Operations",
  description: "Pusat kendali eksekutif superadmin, verifikasi tenant, dan analitik emisi karbon platform.",
};

export default function AdminDashboardPage() {
  return <InternalDashboard />;
}
