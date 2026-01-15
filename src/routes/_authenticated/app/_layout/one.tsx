import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/_layout/one')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/layout/one"!</div>
}
