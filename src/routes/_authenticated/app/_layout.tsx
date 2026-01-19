import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Menu,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useMemo } from "react";
import { LOCAL_STORAGE_USER_KEY } from "@/auth";
import type { JWT } from "@/api";

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
  const navigate = Route.useNavigate();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const location = useLocation();
  const currentTab = useMemo(() => {
    return (
      SIDEBAR_MENU_OPTIONS.find((tab) => location.pathname.includes(tab.to))
        ?.to || "/app/dashboard"
    );
  }, [location]);

  const [user] = useLocalStorage<JWT | null>({
    key: LOCAL_STORAGE_USER_KEY,
    defaultValue: null,
  });

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
        <Flex h="100%" px="md" justify={"space-between"} align={"center"}>
          <Flex>
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
          </Flex>
          <Flex>
            <Menu>
              <Menu.Target>
                <Flex gap={"xs"} style={{ cursor: "pointer" }} align="center">
                  <Flex>
                    <Avatar radius="xl" size={30} children={"PB"} />
                  </Flex>
                  <Flex>{user?.user?.email}</Flex>
                </Flex>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    navigate({ to: "/app/settings/profile" });
                  }}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
                    setTimeout(() => {
                      navigate({ to: "/auth/login" });
                    }, 0);
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>
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
