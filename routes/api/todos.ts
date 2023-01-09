import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { ITodoItem } from "../index.tsx";

const channel = new BroadcastChannel("todos");

let TODOS: ITodoItem[] = [];
export const getTodos = () => {
  return TODOS;
};

const saveTodos = (todos: ITodoItem[]) => {
  TODOS = todos;
  channel.dispatchEvent(new Event("message"));
  return JSON.stringify(TODOS);
};

const headers = { "Content-Type": "application/json" };

export const handler: Handlers = {
  GET() {
    const todos = getTodos();

    const stream = new ReadableStream({
      start: (controller) => {
        channel.onmessage = () => {
          const body = `data: ${JSON.stringify(todos)}\n\n`;
          controller.enqueue(body);
        };
      },
    });

    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: { "content-type": "text/event-stream" },
    });

    // return new Response(JSON.stringify(todos), { headers });
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
