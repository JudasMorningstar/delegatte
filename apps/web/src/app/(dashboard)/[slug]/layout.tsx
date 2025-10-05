import { AppSidebar } from "@/components/navigation/app-sidebar";
import { NavBar } from "@/components/navigation/nav-bar";
// import { NavMain } from "@/components/navigation/nav-main";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import {
  SidebarInset,
  SidebarProvider,
} from "@delegatte/ui/components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { slug } = await params;

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar collapsible="icon" slug={slug} />
        <SidebarInset>
          <NavBar />
          <OrganizationGuard>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:gap-6 md:p-6 md:pt-0">
              {children}
            </div>
          </OrganizationGuard>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
