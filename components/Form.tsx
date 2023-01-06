import { JSX as JSXInternal } from "preact";

interface FormProps {
  value: string;
  onChange: (e: Event) => void;
  onSubmit: (e: Event) => void;
}

export function Form({ value, onChange, onSubmit, ...props }: FormProps) {
  return (
    <form onSubmit={onSubmit} {...props} class="flex gap-2">
      <input
        type="text"
        value={value}
        onInput={onChange}
        class="flex-grow border rounded px-4 py-2"
      />
      <button type="submit" class="border px-4 py-2 rounded">Add</button>
    </form>
  );
}
