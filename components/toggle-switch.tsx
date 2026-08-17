"use client";

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 flex-none rounded-full border transition-colors ${
        checked ? "border-accent bg-accent" : "border-line-strong bg-surface-2"
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-5 w-5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform ${
          checked ? "translate-x-5 bg-accent-ink" : "translate-x-0 bg-ink-faint"
        }`}
      />
    </button>
  );
}
