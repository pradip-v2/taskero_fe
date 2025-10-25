import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/_authenticated/app/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/_authenticated/app/_layout"!</div>
}
