import { Paper, Stack, Text } from "@mantine/core";
import { useDroppable } from "@dnd-kit/core";

import type { Task, TaskStatus } from "@/api";
import { KanbanTaskCard } from "./KanbanTaskCard";

interface Props {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id, // ✅ THIS IS THE KEY
  });

  return (
    <Paper
      ref={setNodeRef}
      w={300}
      p="sm"
      withBorder
      style={{
        backgroundColor: isOver ? "#f1f3f5" : undefined,
      }}
    >
      <Text fw={600} mb="sm">
        {status.title}
      </Text>

      <Stack gap="sm">
        {tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} />
        ))}
      </Stack>
    </Paper>
  );
}
