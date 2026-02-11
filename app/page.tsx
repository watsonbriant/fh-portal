import Link from "next/link";
import { PortalLayout } from "@/components/PortalLayout";
import { SidebarAll } from "@/components/Sidebar";
import { getAllCategories, getNavigationItems } from "@/lib/database";

export default async function Home() {
  const [categories, navItems] = await Promise.all([
    getAllCategories(),
    getNavigationItems(),
  ]);

  const sectionNavItems = navItems.filter((item) => item.href !== "/");

  return (
    <PortalLayout sidebar={<SidebarAll />}>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Freedom House Portal
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to the staff and contractor reference guide.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Browse
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {sectionNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Articles
            </h2>
            <ul className="mt-3 space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {cat.title}
                  </span>
                  <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {cat.articles?.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/${a.section}/${a.slug}`}
                          className="hover:underline hover:text-zinc-900 dark:hover:text-zinc-50"
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PortalLayout>
  );
}