import { TextareaHTMLAttributes } from 'react'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function TextArea({
  label,
  className = '',
  ...props
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-white text-lg font-medium">{label}</label>
      )}
      <textarea
        className={`
          w-full h-48 p-6 rounded-xl text-lg font-normal 
          bg-white text-gray-800 placeholder-gray-400 
          border-2 border-white focus:outline-none focus:ring-2 focus:ring-white/50 
          resize-none
          ${className}
        `}
        {...props}
      />
    </div>
  )
}

export default TextArea

