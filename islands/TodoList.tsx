import { useState } from "preact/hooks";
import { Form } from "../components/Form.tsx";
import TodoItem from "../components/TodoItem.tsx";
import { ITodoItem } from "../routes/index.tsx";

interface TodoListProps {
  todos: ITodoItem[];
}

const headers = { "Content-Type": "application/json" };
const apiPath = "/api/todos";

export default function TodoList({ todos }: TodoListProps) {
  const [todoList, setTodoList] = useState(todos);
  const [newTodoText, setNewTodoText] = useState("");

  const onChange = (e: Event) => {
    const input = e.target as HTMLInputElement;

    setNewTodoText(() => input.value);
  };

  const addNewTodo = async (e: Event) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo: ITodoItem = {
      text: newTodoText,
      done: false,
      id: Date.now(),
    };

    const response = await fetch(apiPath, {
      method: "PUT",
      headers,
      body: JSON.stringify(newTodo),
    });
    const newTodos = await response.json();

    setTodoList(() => newTodos);
    setNewTodoText("");
  };

  const toggleTodo = async (item: ITodoItem) => {
    const response = await fetch(apiPath, {
      method: "POST",
      headers,
      body: JSON.stringify(item),
    });

    const todos: ITodoItem[] = await response.json();
    setTodoList(() => todos);
  };

  const removeTodo = async (item: ITodoItem) => {
    const response = await fetch(apiPath, {
      method: "DELETE",
      headers,
      body: JSON.stringify(item),
    });

    const todos: ITodoItem[] = await response.json();
    setTodoList(() => todos);
  };

  return (
    <>
      <h1 class="text-4xl mb-4 uppercase">
        Todos
      </h1>
      <div class="mb-4">
        <Form
          value={newTodoText}
          onChange={onChange}
          onSubmit={addNewTodo}
        />
      </div>
      <ul class="space-y-3">
        {todoList.map((todo) => (
          <TodoItem
            key={todo.id}
            item={todo}
            toggle={toggleTodo}
            remove={removeTodo}
          />
        ))}
      </ul>
    </>
  );
}
