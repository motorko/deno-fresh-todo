import { ITodoItem } from "./routes/index.tsx";

const channel = new BroadcastChannel("todos");
let TODOS: ITodoItem[] = [];

export const getTodos = () => {
  return TODOS;
};

export const saveTodos = (todos: ITodoItem[]) => {
  TODOS = todos;
  channel.dispatchEvent(new Event("update"));
  return JSON.stringify(TODOS);
};

export default channel;
