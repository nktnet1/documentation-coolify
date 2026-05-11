import {
  Activity,
  Award,
  CodeXml,
  Cog,
  Cpu,
  DatabaseZap,
  ExternalLink,
  FileKey,
  GitMerge,
  LockKeyholeOpen,
  MousePointer,
  RefreshCcwDot,
  Terminal,
  UsersRound,
  Webhook,
} from 'lucide-react';
import { site } from '@/lib/site';

const features = [
  {
    title: 'Any Language',
    details: 'Deploy static sites, APIs, backends, databases, and more with support for all major frameworks.',
    icon: CodeXml,
    color: 'text-cyan-500',
  },
  {
    title: 'Any Server',
    details: 'Deploy to any server: VPS, Raspberry Pi, EC2, your laptop, and more via SSH.',
    icon: Cpu,
    color: 'text-yellow-500',
  },
  {
    title: 'Any Use-Case',
    details: 'Supports single servers, multi-server setups, and Docker Swarm clusters.',
    icon: MousePointer,
    color: 'text-purple-500',
  },
  {
    title: 'Any Service',
    details: 'Deploy any Docker-compatible service, plus a wide range of one-click options.',
    icon: Award,
    color: 'text-emerald-500',
  },
  {
    title: 'Push to Deploy',
    details: 'Git integration with GitHub, GitLab, Bitbucket, Gitea, and other platforms.',
    icon: GitMerge,
    color: 'text-blue-500',
  },
  {
    title: 'Free SSL certificates',
    details: "Automatically sets up and renews Let's Encrypt SSL certificates for custom domains.",
    icon: FileKey,
    color: 'text-red-500',
  },
  {
    title: 'No Vendor Lock-In',
    details: 'Your data and settings stay on your servers for full control and easy portability.',
    icon: LockKeyholeOpen,
    color: 'text-amber-500',
  },
  {
    title: 'Automatic DB Backups',
    details: 'Back up data to S3-compatible storage and restore it with one click if needed.',
    icon: DatabaseZap,
    color: 'text-green-500',
  },
  {
    title: 'Webhooks',
    details: 'Integrate with CI/CD tools like GitHub Actions, GitLab CI, or Bitbucket Pipelines.',
    icon: Webhook,
    color: 'text-fd-foreground',
  },
  {
    title: 'Powerful API',
    details: 'Automate deployments, manage resources, and integrate with your existing tools easily.',
    icon: Cog,
    color: 'text-orange-500',
  },
  {
    title: 'Real-Time Terminal',
    details: 'Run server commands directly from your browser in real-time.',
    icon: Terminal,
    color: 'text-indigo-500',
  },
  {
    title: 'Collaborative',
    details: 'Share projects with your team, control roles, and manage permissions.',
    icon: UsersRound,
    color: 'text-yellow-400',
  },
  {
    title: 'Pull Request Deployments',
    details: 'Deploy commits and pull requests separately for quick reviews and faster teamwork.',
    icon: GitMerge,
    color: 'text-purple-400',
  },
  {
    title: 'Server Automations',
    details: 'Handles server setup tasks automatically after connection, saving you time.',
    icon: RefreshCcwDot,
    color: 'text-teal-500',
  },
  {
    title: 'Monitoring',
    details: 'Monitor deployments, servers, disk usage, and receive alerts for issues.',
    icon: Activity,
    color: 'text-red-400',
  },
];

export function CoolifyHome() {
  return (
    <div className="not-prose mx-auto flex w-full max-w-6xl flex-col gap-14 px-2 py-8 sm:px-4 lg:py-14">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div className="space-y-7">
          <div className="space-y-4">
            <p className="text-5xl font-bold tracking-normal text-fd-foreground sm:text-7xl">Coolify</p>
            <h1 className="text-3xl font-semibold tracking-normal text-fd-foreground sm:text-5xl">Open Source PaaS</h1>
            <p className="max-w-3xl text-lg leading-8 text-fd-muted-foreground sm:text-xl">
              Self-host your own databases, services (like WordPress, Plausible Analytics, Ghost) and applications
              (like Next.js, Nuxt.js, Remix, SvelteKit) with ease.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`${site.docsBasePath}/get-started/introduction`}
              className="inline-flex h-11 items-center rounded-md bg-[#6b16ed] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5f12d8]"
            >
              Get Started
            </a>
            <a
              href="https://github.com/coollabsio/coolify"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-fd-border bg-fd-muted/60 px-5 text-sm font-semibold text-fd-foreground transition hover:bg-fd-muted"
            >
              View Source Code
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>

        <a
          href="https://coolify.io/hetzner"
          className="group overflow-hidden rounded-lg border border-fd-border bg-fd-card text-fd-card-foreground shadow-sm transition hover:border-fd-primary/50"
        >
          <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/60 px-4 py-2 text-sm font-medium">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-yellow-400" />
            <span className="size-3 rounded-full bg-green-400" />
            <span className="ml-2 text-fd-muted-foreground">Terminal</span>
          </div>
          <div className="space-y-3 p-5">
            <p className="text-lg font-semibold">Get €20 Free Credit</p>
            <p className="text-sm leading-6 text-fd-muted-foreground">
              Don't have a server yet? Get started with Hetzner Cloud.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-fd-primary">
              https://coolify.io/hetzner
              <ExternalLink className="size-4 transition group-hover:translate-x-0.5" />
            </div>
          </div>
        </a>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article key={feature.title} className="rounded-lg border border-fd-border bg-fd-card p-5">
              <Icon className={`mb-4 size-6 ${feature.color}`} />
              <h2 className="mb-2 text-base font-semibold tracking-normal text-fd-foreground">{feature.title}</h2>
              <p className="text-sm leading-6 text-fd-muted-foreground">{feature.details}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
