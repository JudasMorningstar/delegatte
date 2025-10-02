import { AppSidebar } from "@/components/navigation/app-sidebar";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import {
  SidebarInset,
  SidebarProvider,
} from "@delegatte/ui/components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          {/* <NavBar /> */}
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
