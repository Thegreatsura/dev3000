import type { Metadata, Route } from "next"
import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAuthorizePath } from "@/lib/auth-redirect"
import { DEV3000_URL } from "@/lib/constants"
import { getDefaultSkillRunnerOpenGraphProfile } from "@/lib/skill-runners"
import { getDefaultTeam } from "@/lib/vercel-teams"

export const dynamic = "force-dynamic"

function getSharePath(runnerId: string): Route {
  return `/skill-runner/${runnerId}` as Route
}

function getSkillRunnerMetadata(runnerId: string, url: string): Metadata {
  const profile = getDefaultSkillRunnerOpenGraphProfile(runnerId)
  const skillName = profile?.name || "Skill Runner"
  const description =
    profile?.executionProfile === "deepsec"
      ? "Run a DeepSec security scan against your Vercel project and get a focused, downloadable report."
      : profile?.description || "Run a high-confidence AI skill against a Vercel project from dev3000."
  const imageUrl = `/api/og/skill-runner/${encodeURIComponent(runnerId)}`

  return {
    title: `${skillName} on dev3000`,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${skillName} on dev3000`,
      description,
      url,
      siteName: "dev3000",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${skillName} skill runner`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${skillName} on dev3000`,
      description,
      images: [imageUrl]
    }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ runnerId: string }> }): Promise<Metadata> {
  const { runnerId } = await params
  return getSkillRunnerMetadata(runnerId, `${DEV3000_URL}/skill-runner/${runnerId}`)
}

export default async function ShareableSkillRunnerPage({ params }: { params: Promise<{ runnerId: string }> }) {
  const { runnerId } = await params
  const profile = getDefaultSkillRunnerOpenGraphProfile(runnerId)
  if (!profile) {
    notFound()
  }

  const sharePath = getSharePath(runnerId)
  const user = await getCurrentUser()
  if (!user) {
    redirect(getAuthorizePath(sharePath))
  }

  const defaultTeam = await getDefaultTeam()
  if (!defaultTeam) {
    notFound()
  }

  redirect(`/${defaultTeam.slug}/skill-runner/${runnerId}/new` as Route)
}
