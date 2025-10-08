import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_layout/one')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/layout/one"!</div>
}
