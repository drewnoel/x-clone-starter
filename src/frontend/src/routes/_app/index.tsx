import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import { CopyLinkIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { sessionQueryOptions } from "@/lib/session"
import { getDisplayName } from "@/lib/user"

export const Route = createFileRoute("/_app/")({
  component: Home,
})

function Home() {
  const { data: session } = useQuery(sessionQueryOptions)
  const displayName = session?.user ? getDisplayName(session.user) : "there"

  const handleCopyInviteLink = async () => {
    if (!navigator.clipboard?.writeText) {
      toast.error("Copying isn't supported in this browser")
      return
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied")
    } catch {
      toast.error("Couldn't copy the link")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Welcome, {displayName}!</h1>
      <p className="text-muted-foreground">
        You're signed in. This is where your work starts.
      </p>
      <div>
        <Button type="button" variant="outline" onClick={handleCopyInviteLink}>
          <HugeiconsIcon icon={CopyLinkIcon} className="size-4" />
          Copy invite link
        </Button>
      </div>
    </div>
  )
}
