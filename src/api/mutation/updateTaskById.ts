import { Task } from "../../ToDoList";

export async function updateTask(task: Task): Promise<Task | null> {
  const url = "http://localhost:5285/todoitems/" + task.id;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error(`Failed to save task with ID: ${task.id}`);
    }

    console.log('Task saved to API successfully');
    // Return the task we sent, as the updated task
    return task;

  } catch (error) {
    console.error('Error saving tasks to API:', error);
    return null;
  }
}

