import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { Warning } from "@phosphor-icons/react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  titulo: string;
  prefixo?: string
}

export function InputForm({titulo, prefixo = '', name, ...props}: InputProps){

  const { register, formState: { errors }, watch } = useFormContext();

  const hasError = !!errors[name];

  const value = watch(name);

  return(
    <div className="max-w-full w-full flex flex-col gap-2">
      <span className={
        `lg:text-xs text-xxs font-normal 
          ${hasError ? 'text-color-danger' : value !== '' && value !== undefined && value !== null ? 'text-color-blue-base' : 'text-color-gray-500'}
        `
      }>{titulo}</span>
      <div className={
        `flex items-center rounded-md px-3 py-2 h-max-[48px] h-[48px] 
          ${hasError ? 'border border-color-danger focus-within:border-2 focus-within:border-color-danger' : value !== '' && value !== undefined && value !== null ? 'border border-color-blue-base focus-within:border-2 focus-within:border-color-blue-base' : 'border border-color-gray-300 focus-within:border-2 focus-within:border-color-blue-base'} 
        `
        }>
        {prefixo && (
          <span className="text-color-gray-400 mr-0.5 text-sm">{prefixo}</span>
        )}
        <input
          className="flex-1 border-0 outline-none focus:ring-0 p-0 text-sm text-color-gray-600"
          autoComplete="off"
          {...register(name)}
          {...props}
        />
      </div>
      <ErrorMessage 
        errors={errors}
        name={name}
        render={({ message }) => <span className="w-full mt-1 text-xs text-color-gray-500 flex flex-row gap-1.5 break-words"><Warning className="text-color-danger w-4 h-4 shrink-0" />{message}</span>}
      />
    </div>
  )
}
