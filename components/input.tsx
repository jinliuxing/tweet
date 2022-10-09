import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label?: string;
  name: string;
  type: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  placeholder?: any;
}

export default function Input({
  label,
  name,
  type,
  register,
  required,
  placeholder,
}: InputProps) {
  return (
    <div>
      {label && (
        <label
          className={
            required
              ? "after:content-['*'] after:ml-0.5 after:text-red-500 mb-1 block text-sm font-medium text-gray-700"
              : "mb-1 block text-sm font-medium text-gray-700"
          }
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="rounded-md relative flex  items-center shadow-sm">
        <input
          id={name}
          {...register}
          type={type}
          required={required}
          placeholder={placeholder}
          className="appearance-none w-full rounded-md shadow-sm px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
  );
}
