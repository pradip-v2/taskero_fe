import { useEffect, useMemo, useState } from "react";
import { Group, MultiSelect, Stack } from "@mantine/core";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { useTaskStatusList } from "@/api";
import { useProjectsTasksList } from "@/api";
import { useTasksPartialUpdate } from "@/api";

import type { Task } from "@/api";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";

interface Props {
  projectId: number;
}

export function KanbanBoard({ projectId }: Props) {
  const { data: statuses, isFetched } = useTaskStatusList();
  const { data: taskResponse, refetch: refetchTasksList } =
    useProjectsTasksList(projectId.toString());
  const updateTask = useTasksPartialUpdate();

  const tasks = taskResponse?.results ?? [];

  const [visibleStatuses, setVisibleStatuses] = useState<number[]>(
    statuses?.map((s) => s.id) ?? [],
  );

  useEffect(() => {
    if (isFetched && statuses) {
      setVisibleStatuses(statuses.map((s) => s.id));
    }
  }, [isFetched, statuses]);

  // Group tasks by status
  const columns = useMemo(() => {
    const map = new Map<number, Task[]>();

    tasks.forEach((task) => {
      if (!task.status) return;
      if (!map.has(task.status)) map.set(task.status, []);
      map.get(task.status)!.push(task);
    });

    return map;
  }, [tasks]);

  // 🔁 Drag logic
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = Number(active.id); // dragged task
    const newStatusId = Number(over.id); // dropped column (status)

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatusId) return;

    updateTask
      .mutateAsync({
        id: taskId,
        data: { status: newStatusId },
      })
      .then(() => {
        refetchTasksList();
      });
  };

  return (
    <Stack>
      {/* Status selector */}
      <MultiSelect
        label="Kanban Columns"
        data={
          statuses?.map((s) => ({
            value: s.id.toString(),
            label: s.title,
          })) ?? []
        }
        value={visibleStatuses.map(String)}
        onChange={(values) => setVisibleStatuses(values.map(Number))}
        searchable
        clearable={false}
      />

      <DndContext onDragEnd={handleDragEnd}>
        <Group align="flex-start" wrap="nowrap">
          {statuses
            ?.filter((s) => visibleStatuses.includes(s.id))
            .map((status) => (
              <KanbanColumn
                key={status.id}
                status={status}
                tasks={columns.get(status.id) ?? []}
              />
            ))}
        </Group>
      </DndContext>
    </Stack>
  );
}
