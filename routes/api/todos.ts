import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { ITodoItem } from "../index.tsx";
import { getTodos, saveTodos } from "../../channel.ts";

export const handler: Handlers = {
  GET() {
    const stream = new ReadableStream({
      start: (controller) => {
        globalThis.addEventListener("update-todos", () => {
          const body = `data: ${JSON.stringify(getTodos())}\n\n`;
          controller.enqueue(body);
        });
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

    saveTodos(todos);
    return new Response(JSON.stringify({ ok: true }));
  },
  async POST(req) {
    const json: ITodoItem = await req.json();
    const todos: ITodoItem[] = getTodos();

    const currentTodo = todos.find((todo) => todo.id === json.id);
    if (currentTodo) {
      currentTodo.done = !currentTodo.done;
    }

    saveTodos(todos);
    return new Response(JSON.stringify({ ok: true }));
  },
  async DELETE(req) {
    const json: ITodoItem = await req.json();
    let todos = getTodos();

    todos = todos.filter((todo) => todo.id !== json.id);

    saveTodos(todos);
    return new Response(JSON.stringify({ ok: true }));
  },
};
