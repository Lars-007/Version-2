export const deleteTaskById = async (id: number) => {
    const url = `http://localhost:5285/todoitems/${id}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });
  
      if (!response.ok) {
        throw new Error(`Failed to delete task with ID: ${id}`);
      }
  
      console.log(`Task with ID: ${id} deleted successfully from API`);
    } catch (error) {
      console.error('Error deleting task from API:', error);
    }
  };