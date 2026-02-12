import { HomeComponents } from "@/components/HomeComponents";
import { PortalLayout } from "@/components/PortalLayout";
import { SidebarAll } from "@/components/Sidebar";

export default async function Home() {
  return (
    <PortalLayout sidebar={<SidebarAll />}>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Freedom House Portal
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to the staff and contractor reference guide.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <HomeComponents />

          <section
            className="mt-10 w-full overflow-hidden rounded-lg"
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
      </div>
    </PortalLayout>
  );
}