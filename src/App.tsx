import Theme from "./theme.tsx";
import ToDoList from "./ToDoList.tsx";
import { ReactQueryDevtools } from "react-query/devtools";

function App() {
  return (
    <>
      <Theme />
      <ToDoList />
      <ReactQueryDevtools />
    </>
  );
}

export default App;
