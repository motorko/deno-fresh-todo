import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { ITodoItem } from "../index.tsx";
import channel, { getTodos, saveTodos } from "../../channel.ts";

const headers = { "Content-Type": "application/json" };

export const handler: Handlers = {
  GET() {
    const todos = getTodos();

    const stream = new ReadableStream({
      start: (controller) => {
        channel.addEventListener("update", () => {
          const body = `data: ${JSON.stringify(todos)}\n\n`;
          controller.enqueue(body);
        });
        // channel.onmessage = () => {

        // };
      },
    });

    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: {
        "content-type": "text/event-stream",
        "Connection": "Keep-Alive",
      },
    });
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
