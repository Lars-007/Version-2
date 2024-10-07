import { Task } from "../../ToDoList";

export async function createTask(task: Task): Promise<Task | null> {
  const url = "http://localhost:5285/todoitems"; // API-Endpunkt zum Erstellen von Tasks

  try {
    const response = await fetch(url, {
      method: 'POST', // POST-Methode für das Erstellen
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task) // Sende den Task als JSON
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const createdTask = await response.json(); // Den erstellten Task von der API erhalten
    console.log('Task created in API successfully');
    return createdTask; // Den erstellten Task zurückgeben

  } catch (error) {
    console.error('Error creating task in API:', error);
    return null; // Bei Fehler null zurückgeben
  }
}