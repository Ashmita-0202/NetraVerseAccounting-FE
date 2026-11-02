import { ButtonElement } from "../FormComponents/Button";
type Props = {
  text: string;
  onClick: () => void;
  tooltip: string;
};
const TooltipButton = ({ text, onClick, tooltip }: Props) => (
  <div className="relative group">
    <ButtonElement
      // icon={icon}
      type="button"
      text={text}
      onClick={onClick}
      className="!text-xs font-bold !bg-teal-500"
    />
    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {tooltip}
    </span>
  </div>
);
export default TooltipButton;
