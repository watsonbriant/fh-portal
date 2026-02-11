import { notFound } from "next/navigation";
import { PortalLayout } from "@/components/PortalLayout";
import { Sidebar } from "@/components/Sidebar";
import { getSections } from "@/lib/database";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export default async function CategoryLayout({ children, params }: LayoutProps) {
  const { category } = await params;
  const validCategories = await getSections();

  if (!validCategories.includes(category)) {
    notFound();
  }

  return (
    <PortalLayout sidebar={<Sidebar categorySection={category} />}>
      {children}
    </PortalLayout>
  );
}