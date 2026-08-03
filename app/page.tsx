import { PortfolioExplorer } from "@/components/PortfolioExplorer";
import { profile, branches } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-dvh">
      <PortfolioExplorer profile={profile} branches={branches} />
    </main>
  );
}
