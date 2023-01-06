import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { ITodoItem } from "../index.tsx";

let TODOS: ITodoItem[] = [];
export const getTodos = () => {
  // const todosString = localStorage.getItem("todos") || "[]";
  // const todos: ITodoItem[] = JSON.parse(todosString);
  return TODOS;
};

const saveTodos = (todos: ITodoItem[]) => {
  // const newTodosString = JSON.stringify(todos);
  // localStorage.setItem("todos", newTodosString);
  TODOS = todos;
  return JSON.stringify(TODOS);
};

const headers = { "Content-Type": "application/json" };

export const handler: Handlers = {
  GET(_) {
    const todos = getTodos();

    return new Response(JSON.stringify(todos), { headers });
  },
  async PUT(req) {
    const json: ITodoItem = await req.json();
    const todos: ITodoItem[] = getTodos();

    todos.push(json);

    const newTodosString = saveTodos(todos);
    return new Response(newTodosString);
  },
  async POST(req) {
    const json: ITodoItem = await req.json();
    const todos: ITodoItem[] = getTodos();

    const currentTodo = todos.find((todo) => todo.id === json.id);
    if (currentTodo) {
      currentTodo.done = !currentTodo.done;
    }

    const newTodosString = saveTodos(todos);
    return new Response(newTodosString, { headers });
  },
  async DELETE(req) {
    const json: ITodoItem = await req.json();
    let todos = getTodos();

    todos = todos.filter((todo) => todo.id !== json.id);

    const newTodosString = saveTodos(todos);
    return new Response(newTodosString, { headers });
  },
};
