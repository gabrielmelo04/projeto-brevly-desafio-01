import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "primary" | "defaultIcon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className = "", variant = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseClasses =
      "inline-flex items-center justify-center text-sm font-medium rounded-md h-max-[48px] h-min-[32px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"

    const variants: Record<string, string> = {
      default: "bg-color-gray-200 text-color-gray-500 font-bold hover:bg-color-gray-300 px-4 py-4",
      primary: "bg-color-blue-base text-color-white font-bold hover:bg-color-blue-dark transition-colors duration-300 px-4 py-4",
      defaultIcon: "bg-color-gray-200 text-color-gray-500 hover:bg-color-gray-300 px-0 py-0 lg:p-4",
    }

    return (
      <Comp
        ref={ref}
        className={`${baseClasses} ${variants[variant] || ""} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
export default Button