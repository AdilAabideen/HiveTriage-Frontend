import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-white text-nhs hover:bg-gray-100',
  secondary: 'bg-nhs text-white hover:bg-nhs/90 border-2 border-white',
  ghost: 'bg-transparent text-white hover:bg-white/10 border-2 border-white',
}

const disabledStyles: Record<ButtonVariant, string> = {
  primary: 'bg-white/30 text-white/50 cursor-not-allowed hover:bg-white/30',
  secondary: 'bg-nhs/50 text-white/50 cursor-not-allowed hover:bg-nhs/50 border-white/50',
  ghost: 'bg-transparent text-white/50 cursor-not-allowed hover:bg-transparent border-white/50',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-6 text-base rounded-lg',
  md: 'py-3 px-8 text-lg rounded-xl',
  lg: 'py-4 px-12 text-xl rounded-full',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  children,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 cursor-pointer'
  const styles = disabled ? disabledStyles[variant] : variantStyles[variant]
  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${styles} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

