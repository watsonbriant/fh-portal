import Link from "next/link";
import { EasternDateAndTime } from "@/components/EasternDateAndTime";
import { PortalLayout } from "@/components/PortalLayout";
import { SidebarAll } from "@/components/Sidebar";
import { getNavigationItems } from "@/lib/database";

export default async function Home() {
  const navItems = await getNavigationItems();
  const sectionNavItems = navItems.filter((item) => item.href !== "/");

  return (
    <PortalLayout sidebar={<SidebarAll />}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Freedom House Portal
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to the staff and contractor reference guide.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <EasternDateAndTime />

          <section
            className="overflow-hidden rounded-lg"
            style={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingTop: "129.4118%",
              paddingBottom: 0,
              boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <iframe
              loading="lazy"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                border: "none",
                padding: 0,
                margin: 0,
              }}
              src="https://www.canva.com/design/DAG0AwGtZq8/QhYlch2uaysoxy7GQ6vCRA/view?embed"
              allowFullScreen
              allow="fullscreen"
              title="Canva embed"
            />
          </section>
        </div>

        <section className="mt-10">
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

          {/* Articles section - commented out for now, can re-add later */}
          {/* <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Articles
            </h2>
            <ul className="mt-3 space-y-4">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {cat.title}
                  </span>
                  {(cat.sections || []).map((section) => (
                    <div key={section.id} className="mt-2">
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {section.title}
                      </span>
                      <ul className="mt-0.5 flex flex-wrap gap-x-4 gap-y-[1px] text-sm text-zinc-600 dark:text-zinc-400">
                        {(section.articles || []).map((a) => (
                          <li key={a.slug}>
                            <Link
                              href={`/${cat.section}/${section.id}/${a.slug}`}
                              className="hover:underline hover:text-zinc-900 dark:hover:text-zinc-50"
                            >
                              {a.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </section> */}
      </div>
    </PortalLayout>
  );
}