import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@delegatte/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { DashboardNavBar } from "../components/dahboard-navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  slug: string;
}
export const DashboardLayout = async ({
  slug,
  children,
}: DashboardLayoutProps) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "open";

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <OrganizationGuard slug={slug}>
          <DashboardSidebar slug={slug} />
          <SidebarInset>
            <DashboardNavBar />
            <main className="flex flex-col flex-1">{children}</main>
          </SidebarInset>
        </OrganizationGuard>
      </SidebarProvider>
    </AuthGuard>
  );
};
