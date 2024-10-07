import { Task } from '../../ToDoList';

export const getTasks = async (): Promise<Task[]> => {
    const url = "http://localhost:5285/todoitems";
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json;
    } catch (error: any) {
      console.error(error.message);
      return [];
    }
  };