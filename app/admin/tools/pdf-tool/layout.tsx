import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarWrapper } from "@/modules/dashboard/componets/sidebar-wrapper";
import { AppSidebar } from "@/modules/dashboard/componets/app-sidebar";
import AppHeader from "@/modules/dashboard/componets/app-header";

export default function PDFToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarWrapper>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarWrapper>
  );
}
