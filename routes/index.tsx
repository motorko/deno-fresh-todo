import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

import TodoList from "../islands/TodoList.tsx";
import { getTodos } from "../channel.ts";

export interface ITodoItem {
  text: string;
  done: boolean;
  id: number;
}

export const handler: Handlers = {
  GET(_, ctx) {
    const todos = getTodos();

    return ctx.render(todos);
  },
};

export default function Home({ data }: PageProps<ITodoItem[]>) {
  return (
    <>
      <Head>
        <title>Todos</title>
      </Head>
      <div class="w-4/5 xl:w-1/2 mx-auto py-10 font-mono">
        <TodoList todos={data} />
      </div>
    </>
  );
}
