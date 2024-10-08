import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Label,
} from '@headlessui/react';
import classNames from 'classnames';

export interface SelectOption<Value> {
  label: string;
  value: Value;
}

interface SelectProps<Value> {
  className?: string;
  label: string;
  onChange?: (value: Value) => void;
  options: Array<SelectOption<Value>>;
  value: Value;
}

export const Select = <Value extends string>({
  className,
  label,
  options,
  onChange,
  value,
}: SelectProps<Value>) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <Label>{label}</Label>
      <div className={classNames('relative', className)}>
        <ListboxButton
          className={classNames(
            'w-full rounded-md border-2 p-3 text-left',
            className
          )}
        >
          {options.find((option) => option.value === value)?.label ??
            'Select...'}
        </ListboxButton>
        <ListboxOptions
          className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg"
          style={{ zIndex: 999999999999999 }}
        >
          {options.map(({ label, value }) => (
            <ListboxOption
              key={String(value)}
              value={value}
              className={({ active }) =>
                classNames(
                  'cursor-pointer select-none p-3',
                  active ? 'bg-blue-400 text-white' : 'text-black'
                )
              }
            >
              {label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};
