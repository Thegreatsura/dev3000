function LoadingBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-[#1a1a1a] ${className}`} />
}

function LoadingProjectRow() {
  return (
    <div className="flex items-center justify-between rounded-md border border-[#1f1f1f] px-3 py-2.5">
      <div className="min-w-0 space-y-2">
        <LoadingBlock className="h-4 w-36" />
        <LoadingBlock className="h-3 w-64 max-w-full" />
      </div>
      <LoadingBlock className="size-4 shrink-0 rounded-full" />
    </div>
  )
}

export default function LoadingRunSkillRunnerPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-[#ededed]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[#1f1f1f] lg:flex">
          <div className="flex h-[60px] items-center border-b border-[#1f1f1f] px-2">
            <div className="flex h-11 w-full items-center gap-2.5 rounded-xl px-2.5">
              <LoadingBlock className="size-4 rounded-full" />
              <LoadingBlock className="h-4 w-28" />
              <LoadingBlock className="ml-auto size-7" />
            </div>
          </div>
          <nav className="flex-1 px-2 pt-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5 rounded-md bg-[#1a1a1a] px-2.5 py-[7px]">
                <LoadingBlock className="size-4" />
                <LoadingBlock className="h-4 w-12" />
              </div>
              <div className="flex items-center gap-2.5 rounded-md px-2.5 py-[7px]">
                <LoadingBlock className="size-4" />
                <LoadingBlock className="h-4 w-10" />
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[60px] shrink-0 items-center border-b border-[#1f1f1f] px-6">
            <div className="flex items-center gap-2">
              <LoadingBlock className="h-4 w-20" />
              <span className="text-[#444]">/</span>
              <LoadingBlock className="h-4 w-10" />
            </div>
          </header>

          <div className="flex-1 px-6 py-6">
            <div className="mb-6 space-y-2">
              <LoadingBlock className="h-8 w-72 max-w-full" />
              <LoadingBlock className="h-5 w-[34rem] max-w-full" />
              <LoadingBlock className="h-5 w-[28rem] max-w-full" />
            </div>

            <div className="space-y-5">
              <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a]">
                <div className="flex items-center gap-5 border-b border-[#1f1f1f] px-4 py-3">
                  <LoadingBlock className="h-4 w-24" />
                  <LoadingBlock className="h-4 w-20" />
                  <LoadingBlock className="h-5 w-16" />
                  <LoadingBlock className="ml-auto h-8 w-20" />
                </div>
                <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:max-w-xs">
                  <div className="space-y-2">
                    <LoadingBlock className="h-3 w-12" />
                    <LoadingBlock className="h-4 w-8" />
                  </div>
                  <div className="space-y-2">
                    <LoadingBlock className="h-3 w-16" />
                    <LoadingBlock className="h-4 w-14" />
                  </div>
                </div>
                <div className="border-t border-[#1f1f1f] px-4 py-3">
                  <LoadingBlock className="h-4 w-24" />
                  <LoadingBlock className="mt-2 h-4 w-[30rem] max-w-full" />
                </div>
              </div>

              <div className="rounded-lg border border-[#1f1f1f] bg-[#111] px-4 py-3">
                <LoadingBlock className="h-3 w-20" />
                <LoadingBlock className="mt-2 h-4 w-56" />
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-lg border border-[#1f1f1f] p-5">
                  <LoadingBlock className="h-5 w-16" />
                  <LoadingBlock className="mt-2 h-4 w-44" />
                  <LoadingBlock className="mt-5 h-9 w-full" />
                  <div className="mt-3 space-y-1">
                    <LoadingProjectRow />
                    <LoadingProjectRow />
                    <LoadingProjectRow />
                    <LoadingProjectRow />
                  </div>
                </div>

                <div className="rounded-lg border border-[#1f1f1f] p-5">
                  <LoadingBlock className="h-5 w-28" />
                  <LoadingBlock className="mt-2 h-4 w-64 max-w-full" />
                  <LoadingBlock className="mt-6 h-20 w-full" />
                  <LoadingBlock className="mt-5 h-9 w-32" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
