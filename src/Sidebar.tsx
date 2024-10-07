import { Drawer, Button, Input, Space } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { Task } from "./ToDoList";
import { updateTask } from "./api/mutation/updateTaskById";
import { Select } from "@mantine/core";
import { useMutation, useQueryClient } from "react-query";

//const queryClient = useQueryClient();

const categories = [
  { value: "1", label: "🍎 groceries" },
  { value: "2", label: "🛒 shopping" },
  { value: "3", label: "💼 work" },
  { value: "4", label: "🏫 school" },
  { value: "5", label: "🔒 private" },
];
type SidebarProps = {
  opened: boolean;
  close: () => void;
  taskToEdit?: Task;
  setTaskToEdit: (task: Task) => void;
};

function Sidebar({ opened, close, taskToEdit, setTaskToEdit }: SidebarProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
      close();
      console.log("sync hat funktoniert");
    },
  });

  const handleUpdateTask = () => {
    if (taskToEdit) {
      updateMutation.mutate(taskToEdit);
    } else {
      console.log("Error with updateTask");
    }
  };

  return (
    <>
      <Drawer.Root opened={opened} onClose={close}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title style={{ fontSize: "25px", fontWeight: "bold" }}>
              Edit your Task:
            </Drawer.Title>
          </Drawer.Header>
            <Drawer.CloseButton />
          <Drawer.Body>
            <Input
              value={taskToEdit?.name || ""}
              placeholder="Task Name:"
              onChange={
                (e) => setTaskToEdit({ ...taskToEdit, name: e.target.value }) //... copys all from taskToEdit
              }
            />
            <Space h="sm" />
            <Input
              value={taskToEdit?.description || ""} // Fallback, falls undefined
              placeholder="Description"
              onChange={(e) =>
                setTaskToEdit({ ...taskToEdit, description: e.target.value })
              }
            />
            <DateTimePicker
              label="Pick date and time"
              value={
                taskToEdit?.taskTime ? new Date(taskToEdit.taskTime) : null
              }
              placeholder="Pick date and time"
              onChange={(date) =>
                setTaskToEdit({
                  ...taskToEdit!,
                  taskTime: date ? date.toISOString() : undefined,
                })
              }
            />

            <Space h="sm" />
            <Select
              label="Categories:"
              placeholder="Select a category"
              data={categories} // Verwende von Kategorien (Array) ⬆️
              value={
                taskToEdit?.categoryId ? String(taskToEdit.categoryId) : null
              }
              onChange={(value) =>
                setTaskToEdit({
                  ...taskToEdit!, // only change the value of categoryId
                  categoryId: value ? Number(value) : undefined,
                })
              }
            />

            <Space h="sm" />

            <Button onClick={() => handleUpdateTask(taskToEdit)}>Save</Button>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default Sidebar;
