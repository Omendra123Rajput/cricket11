import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  Zap,
  BarChart3,
  Shield,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Private Friend Contests",
    description:
      "Create invite-only leagues for your friend group. Share a link, they join instantly.",
  },
  {
    icon: Zap,
    title: "Live Score Sync",
    description:
      "Real-time fantasy points updated during matches. Watch your rank change live.",
  },
  {
    icon: Trophy,
    title: "Season Leaderboard",
    description:
      "Track standings across the entire IPL season. Crown the ultimate champion.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Player form, venue trends, and captain success rates to build winning teams.",
  },
  {
    icon: Shield,
    title: "Dream11-Style Teams",
    description:
      "Pick 11 players within 100 credits. Choose captain (2x) and vice-captain (1.5x).",
  },
  {
    icon: Zap,
    title: "Badges & Streaks",
    description:
      "Earn badges for achievements. Maintain streaks. Flex your fantasy skills.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <nav className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">CrickContest</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-6">
            <Zap className="w-3.5 h-3.5" />
            IPL 2026 Season is Live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Fantasy Cricket
            <br />
            <span className="gradient-text">With Your Squad</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Create private contests, build your dream team, and compete with
            friends across the entire IPL season. Free forever.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Playing Free
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
              >
                Join a Contest
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Live</div>
              <div className="text-sm text-muted-foreground">Score Sync</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">74+</div>
              <div className="text-sm text-muted-foreground">IPL Matches</div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Everything You Need
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          All the features of Dream11, but private, free, and built for your
          friend group.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-xl p-6 hover:border-primary/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-t border-border/50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Create Contest",
              desc: "Pick an IPL match and create a private contest",
            },
            {
              step: "2",
              title: "Invite Friends",
              desc: "Share the invite link or code with your group",
            },
            {
              step: "3",
              title: "Build Your Team",
              desc: "Select 11 players within 100 credits, pick captain & VC",
            },
            {
              step: "4",
              title: "Watch & Win",
              desc: "Live fantasy points update. Top ranks earn season points",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="glass rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first contest in under a minute. No payments, no ads,
            just pure fantasy cricket.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8">
              Get Started Free
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span>CrickContest</span>
          </div>
          <p>Built for friends who love cricket</p>
        </div>
      </footer>
    </div>
  );
}
