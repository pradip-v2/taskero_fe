import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/app/_layout")({
  component: RouteComponent,
});

const SIDEBAR_MENU_OPTIONS = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Projects", to: "/app/projects" },
  {
    label: "Settings",
    to: "/app/settings/profile",
  },
];

function RouteComponent() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const location = useLocation();
  const currentTab = useMemo(() => {
    return (
      SIDEBAR_MENU_OPTIONS.find((tab) => location.pathname.includes(tab.to))
        ?.to || "/app/dashboard"
    );
  }, [location]);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          The burger icon is always visible
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section p="md">Navbar header</AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea} px="md">
          <Text mb="sm">60 links in a scrollable section:</Text>

          {SIDEBAR_MENU_OPTIONS.map(({ label, to }) => (
            <NavLink
              component={Link}
              href={to}
              key={to}
              label={label}
              variant="light"
              active={currentTab === to}
            ></NavLink>
          ))}
        </AppShell.Section>
        <AppShell.Section p="md">
          Navbar footer – always at the bottom
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
