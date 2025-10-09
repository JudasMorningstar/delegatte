import { DashboardLayout } from "@/modules/dashboard/ui/layout/dashboard-layout";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;

  return <DashboardLayout slug={slug}>{children}</DashboardLayout>;
}
