import { PortalLayout } from "@/components/PortalLayout";
import { Sidebar } from "@/components/Sidebar";

export default function PortalLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayout sidebar={<Sidebar section="portal" />}>{children}</PortalLayout>
  );
}
