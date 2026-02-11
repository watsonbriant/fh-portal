import { notFound } from "next/navigation";
import { PortalLayout } from "@/components/PortalLayout";
import { Sidebar } from "@/components/Sidebar";
import { getSections } from "@/lib/database";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
}

export default async function SectionLayout({ children, params }: LayoutProps) {
  const { section } = await params;
  const validSections = await getSections();

  if (!validSections.includes(section)) {
    notFound();
  }

  return (
    <PortalLayout sidebar={<Sidebar section={section} />}>{children}</PortalLayout>
  );
}
