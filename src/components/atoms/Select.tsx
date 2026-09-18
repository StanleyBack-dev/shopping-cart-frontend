interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  'aria-label': string;
}

export function Select<T extends string>({
  value,
  options,
  onChange,
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value as T)}
      className="rounded-card border border-hairline bg-card px-3 py-2 text-sm text-ink"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
