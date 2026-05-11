import services from '../generated/services.json';

type Service = {
  name: string;
  slug: string;
  description: string;
  category: string;
  logo?: string;
};

const serviceList = services as Service[];

export function ServicesList() {
  const categories = Array.from(new Set(serviceList.map((service) => service.category))).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <div className="not-prose my-8 space-y-10">
      {categories.map((category) => {
        const items = serviceList
          .filter((service) => service.category === category)
          .sort((a, b) => a.name.localeCompare(b.name));

        return (
          <section key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-fd-foreground">{category}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <a
                  key={service.slug}
                  href={`/docs/services/${service.slug}`}
                  className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
                >
                  <div className="flex items-start gap-3">
                    {service.logo ? (
                      <img src={service.logo} alt="" className="mt-1 size-8 rounded object-contain" loading="lazy" />
                    ) : null}
                    <div className="min-w-0">
                      <h3 className="font-medium text-fd-foreground">{service.name}</h3>
                      <p className="mt-1 line-clamp-3 text-sm text-fd-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
