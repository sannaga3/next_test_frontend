import { buttonTextSizes } from "../constants";

const Button = ({
  text,
  type,
  onClick,
  width,
  height,
  textSize = "base",
  useDefaultClass = true,
  classProps = "",
  disabled = false,
}) => {
  const buttonStyle = useDefaultClass
    ? `text-white text-center px-2 border rounded-full hover:scale-105`
    : classProps;

  const selectedSize = buttonTextSizes.find((size) => size.key === textSize);

  return (
    <button
      onClick={onClick}
      type={type}
      className={buttonStyle}
      disabled={disabled}
      style={{
        width: width,
        height: height,
        fontSize: selectedSize.value,
      }}
    >
      {text}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
