"use client";

export default function Button({
  children,
  icon,
  iconPosition = "left",
  iconBg = false,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary-950 text-white hover:bg-primary-900 focus:ring-primary-950",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline:
      "border border-primary-950 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const getIconBgStyle = () => {
    if (!iconBg) return {};

    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#454545", // primary-800 color
          borderRadius: "50%",
          padding: "4px",
        };
      default:
        return {};
    }
  };

  const iconBgClasses = {
    primary: iconBg ? "icon-bg-primary" : "",
    secondary: iconBg ? "bg-gray-100 rounded-full p-1" : "",
    outline: iconBg ? "bg-gray-50 rounded-full p-1" : "",
    ghost: iconBg ? "bg-gray-50 rounded-full p-1" : "",
    danger: iconBg ? "bg-red-500 rounded-full p-1" : "",
  };

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span
          className={`${iconSizes[size]} ${
            children ? "mr-2" : ""
          } flex items-center justify-center ${iconBgClasses[variant]}`}
          style={variant === "primary" ? getIconBgStyle() : {}}
        >
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span
          className={`${iconSizes[size]} ${
            children ? "ml-2" : ""
          } flex items-center justify-center ${iconBgClasses[variant]}`}
          style={variant === "primary" ? getIconBgStyle() : {}}
        >
          {icon}
        </span>
      )}
    </button>
  );
}
