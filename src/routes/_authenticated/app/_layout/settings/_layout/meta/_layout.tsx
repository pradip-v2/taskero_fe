import { Flex, Tabs } from "@mantine/core";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/settings/_layout/meta/_layout"
)({
  component: RouteComponent,
});

const SETTINGS_META_TABS = [{ label: "Task Statuses", to: "task-statuses" }];

function RouteComponent() {
  const navigate = Route.useNavigate();

  return (
    <Flex direction="column" w={"100%"}>
      <Flex direction="column" w={"100%"} pos={"sticky"} top={0} bg="white">
        <Tabs>
          <Tabs.List>
            {SETTINGS_META_TABS.map((tab) => (
              <Tabs.Tab
                key={tab.to}
                value={tab.to}
                component={Link}
                onClick={() => {
                  navigate({ to: "/app/settings/meta/" + tab.to });
                }}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Flex>
      <Flex direction="column" w={"100%"}>
        <Outlet />
      </Flex>
    </Flex>
  );
}
