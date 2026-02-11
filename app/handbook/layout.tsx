import { PortalLayout } from "@/components/PortalLayout";
import { Sidebar } from "@/components/Sidebar";

export default function HandbookLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayout sidebar={<Sidebar section="handbook" />}>{children}</PortalLayout>
  );
}
