import { useProjectsRetrieve } from "@/api";
import { ProjectContext } from "@/context/ProjectProvider";
import { Flex, LoadingOverlay, Tabs, Title, Text } from "@mantine/core";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/project/$projectId/_layout",
)({
  component: RouteComponent,
});

const PROJECT_TABS = [
  { label: "Summary", value: "summary", to: "/app/project/$projectId/summary" },
  { label: "Tasks", value: "tasks", to: "/app/project/$projectId/tasks" },
  { label: "Kanban", value: "kanban", to: "/app/project/$projectId/kanban" },
  { label: "Members", value: "members", to: "/app/project/$projectId/members" },
];

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { projectId } = Route.useParams();
  const location = useLocation();
  const currentTab = location.pathname.split("/").at(4) || "summary";

  const { data: project, isLoading } = useProjectsRetrieve(+projectId);

  return (
    <Flex direction={"column"}>
      <LoadingOverlay visible={isLoading} />
      <Flex direction={"column"} pos={"fixed"} bg={"white"} w={"100%"}>
        <Flex direction={"column"} gap={5}>
          <Title order={2}>{project?.title}</Title>
          <Flex>
            <Title order={6}>Owner</Title>
            <Text>: {project?.owner_data?.name}</Text>
          </Flex>
        </Flex>

        <Tabs defaultValue={"summary"} value={currentTab}>
          <Tabs.List>
            {PROJECT_TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                onClick={() => {
                  navigate({ to: tab.to.replace("$projectId", projectId) });
                }}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Flex>
      <Flex
        mt={150} // to be adjusted later
      >
        <ProjectContext.Provider value={{ project: project || null }}>
          <Outlet />
        </ProjectContext.Provider>
      </Flex>
    </Flex>
  );
}
