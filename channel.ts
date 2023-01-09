import { ITodoItem } from "./routes/index.tsx";

let TODOS: ITodoItem[] = [];

export const getTodos = () => {
  return TODOS;
};

export const saveTodos = (todos: ITodoItem[]) => {
  TODOS = todos;
  globalThis.dispatchEvent(new CustomEvent("update-todos"));
};
