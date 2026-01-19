import { Paper, Text, Group, Avatar, Badge } from "@mantine/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "@/api";

interface Props {
  task: Task;
}

export function KanbanTaskCard({ task }: Props) {
  const { setNodeRef, attributes, listeners, transform } = useDraggable({
    id: task.id, // ✅ task id
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      p="sm"
      withBorder
      shadow="xs"
      {...listeners}
      {...attributes}
    >
      <Text fw={500}>{task.title}</Text>

      <Group justify="space-between" mt="xs">
        {task.assignee_data && (
          <Group gap="xs">
            <Avatar size="sm">{task?.assignee_data?.name?.[0]}</Avatar>
            <Text size="xs">{task?.assignee_data?.name}</Text>
          </Group>
        )}

        {task.subtasks_count > 0 && (
          <Badge size="xs" variant="light">
            {task.subtasks_count} subtasks
          </Badge>
        )}
      </Group>
    </Paper>
  );
}
