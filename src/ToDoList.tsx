import React, { useState } from "react";
import {
  Button,
  Center,
  Container,
  Group,
  Input,
  Space,
  Stack,
  Title,
  Text,
  Image,
  Checkbox,
} from "@mantine/core";
import reminderUrl from "./assets/reminders.png";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "./Sidebar";
import { getTasks } from "./api/query/getAllTasks";
import { deleteTaskById } from "./api/mutation/deleteTaskById";
import { createTask } from "./api/mutation/createTask";
import { updateTask } from "./api/mutation/updateTaskById";
import { useMutation, useQuery, useQueryClient } from "react-query";

export type Task = {
  // ? = cann be undefined
  id: number;
  name: string;
  completed: boolean;
  description?: string;
  categoryId?: number;
  taskTime?: Date;
};

function ToDoList() {
  const [taskToEdit, setTaskToEdit] = useState<Task>(); // Task-Namen speichern
  const [newTaskName, setNewTaskName] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const queryClient = useQueryClient();

  //QUERY
  const { data: tasks } = useQuery("tasks", getTasks);

  //MUTATION
  const createMutation = useMutation(createTask, {
    onSuccess: () => {
      // Invalidate and refetch
      setNewTaskName("");
      queryClient.invalidateQueries("tasks");
    },
  });

  const updateMutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
      close();
    },
  });

  const deleteMutation = useMutation(deleteTaskById, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("tasks");
    },
  });

  function handleInputChange(event: any) {
    setNewTaskName(event.target.value); //
  }

  async function addTask() {
    if (newTaskName.trim() !== "") {
      const newTask: Task = {
        id: 0, // Platzhalter, die tatsächliche ID kommt von der API
        name: newTaskName,
        completed: false,
        description: "",
        // Weitere Felder falls nötig
      };
      await createMutation.mutate(newTask);
    }
  }

  //Aufgabe hinzufügen, wenn ENTER gedrückt wird.
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  function openSidebar(task: Task) {
    setTaskToEdit(task); // Task mit status Edit
    open(); // Sidebar öffnen
  }

  //  onClick = Event Listener
  return (
    <>
      <Container>
        <Stack>
          <Center>
            <Image
              radius="md"
              style={{ boxShadow: "0px 0px 1px 0px black" }}
              h={97}
              w="auto"
              fit="contain"
              src={reminderUrl}
            />
            <Space w={20} />
            <Title>To Do</Title>
          </Center>

          <Space h={12} />

          <Center>
            <Group>
              <Input
                id="test"
                size={"md"}
                radius="xl"
                type="text"
                placeholder="✍️ Enter your task..."
                value={newTaskName}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyPress(e)} // Enter add Task
              />
              <Button
                variant="light"
                color="indigo"
                size="md"
                radius="xl"
                onClick={addTask}
              >
                Add
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 19 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M9 12h6" />
                  <path d="M12 9v6" />
                </svg>
              </Button>
            </Group>
          </Center>

          <Center>
            <Stack gap="sm">
              {tasks?.map((task: Task, index: number) => (
                <Group key={index} justify="space-between">
                  <Group w={{ xs: 300, sm: 405, md: 600, lg: 700 }}>
                    <Checkbox
                      radius="xl"
                      size="md"
                      checked={task.completed}
                      onChange={(e) => {
                        const updatedTask = {
                          ...task,
                          completed: e.currentTarget.checked,
                        };
                        updateMutation.mutate(updatedTask);
                      }}
                    />
                    <Text>{task.name}</Text>
                  </Group>

                  <Group>
                    <Button
                      variant="filled"
                      color="orange"
                      size="sm"
                      radius="xl"
                      className="edit-button"
                      onClick={() => openSidebar(task)} // Task-Namen übergeben
                    >
                      Edit ✏️
                    </Button>

                    <Button
                      variant="filled"
                      color="red"
                      size="sm"
                      radius="xl"
                      className="delete-button"
                      onClick={() => deleteMutation.mutate(task.id)}
                    >
                      Delete ✗
                    </Button>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Center>
        </Stack>

        <Center>
          <Space h={120} />
          <Text size="md">Total tasks: {tasks?.length}</Text>
        </Center>
        <Sidebar
          opened={opened}
          close={close}
          taskToEdit={taskToEdit}
          setTaskToEdit={setTaskToEdit}
        />
      </Container>
    </>
  );
}

export default ToDoList;
