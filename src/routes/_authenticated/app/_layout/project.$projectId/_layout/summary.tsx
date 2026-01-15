import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/app/_layout/project/$projectId/_layout/summary',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_authenticated/app/_layout/project/$projectId/_layout/summary"!
    </div>
  )
}
