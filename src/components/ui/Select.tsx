import { SelectHTMLAttributes } from 'react'

export interface SelectOption<T extends string = string> {
  value: T | ''
  label: string
}

export interface SelectProps<T extends string = string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label?: string
  options: SelectOption<T>[]
  value: T | ''
  onChange: (value: T | '') => void
  placeholder?: string
}

export function Select<T extends string = string>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  ...props
}: SelectProps<T>) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      {label && (
        <label className="text-white text-lg font-medium">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | '')}
        className={`
          w-full py-3 px-4 rounded-xl text-lg font-normal 
          bg-white text-gray-800 border-2 border-white 
          focus:outline-none focus:ring-2 focus:ring-white/50 
          cursor-pointer
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select

