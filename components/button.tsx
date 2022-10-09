import Icon, { IconName } from "./icon";

interface ButtonProps {
  onClick?: () => void;
  text: string;
  icon?: IconName;
  disabled?: boolean;
  [key: string]: any;
}

const Button = ({
  loading = false,
  onClick,
  text,
  level = "primary",
  classes = "",
  icon = null,
  disabled = false,
  ...rest
}: ButtonProps) => {
  const className =
    "outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-full px-5 py-2.5 text-white bg-theme" +
    (disabled
      ? " bg-slate-400 hover:bg-gray"
      : " bg-theme hover:bg-theme-dark");
  return (
    <button
      {...rest}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      <div className="flex justify-center items-center gap-2 relative">
        <div className="w-8 h-8 flex justify-center items-center">
          {icon && Icon({ name: icon })}
        </div>
        <div className="w-fit whitespace-nowrap">{text}</div>
      </div>
    </button>
  );
};

export default Button;
