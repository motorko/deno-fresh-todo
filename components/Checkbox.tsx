interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

export default function Checkbox({ checked, onClick }: CheckboxProps) {
  return (
    <div
      onClick={onClick}
      class={`w-[20px] h-[20px] flex relative border transition-all hover:border-black rounded-full outline-none ${
        checked ? "border-black" : ""
      }`}
    >
      {checked
        ? (
          <div class="w-1/2 h-1/2 rounded-full bg-green-300 absolute top-1/2 left-1/2 -translate-1/2">
          </div>
        )
        : null}
    </div>
  );
}
