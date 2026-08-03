import { Mail, Linkedin } from "lucide-react";
import { Eyebrow } from "./ui/Eyebrow";
import { Chip } from "./ui/Chip";
import type { Profile } from "@/lib/types";

/**
 * The identity card. Anchors the tree on the left; sticky on desktop so it
 * stays in view as branches expand.
 */
export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <aside className="lg:sticky lg:top-20">
      <div className="rounded-card border border-line bg-surface p-8 shadow-card sm:p-10">
        <Eyebrow>{profile.kicker}</Eyebrow>

        <h1 className="mt-6 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[35px]">
          {profile.name}
        </h1>

        <p className="mt-6 text-[16px] leading-[1.55] text-ink-secondary">
          {profile.lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>

        <p className="mt-3.5 text-[14px] leading-[1.6] text-ink-tertiary">
          {profile.note}
        </p>

        <div className="mt-10">
          <Eyebrow>Skills</Eyebrow>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Chip key={skill}>{skill}</Chip>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-3 border-t border-line pt-7">
          <a
            href={`mailto:${profile.email}`}
            className="group flex items-center gap-3 text-[14px] text-ink-secondary transition-colors duration-200 hover:text-ink"
          >
            <Mail className="size-4 text-ink-tertiary transition-colors group-hover:text-ink-secondary" />
            {profile.email}
          </a>
          <a
            href={profile.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 text-[14px] text-ink-secondary transition-colors duration-200 hover:text-ink"
          >
            <Linkedin className="size-4 text-ink-tertiary transition-colors group-hover:text-ink-secondary" />
            {profile.linkedin.label}
          </a>
        </div>
      </div>
    </aside>
  );
}
