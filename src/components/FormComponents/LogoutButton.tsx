import {
  buttonClassNames,
  makeStyles,
  tokens,
  Button,
  Spinner,
  ButtonProps,
  FluentProvider,
  webLightTheme,
} from "@fluentui/react-components";
import Overlay from "../Loaders/Overlays";

interface PropsT {
  text: string;
  handleClick?: () => void;
  size?: "large" | "medium" | "small";
}

interface IButtonSubmit extends PropsT {
  type: "submit";
  isLoading?: boolean;
}

interface IButtonButton extends PropsT {
  type: "button";
  isLoading?: boolean;
}

const useStyles = makeStyles({
  wrapper: {
    columnGap: "15px",
    display: "flex",
  },
  primaryButton: {
    backgroundColor: "#14b8a6",
    cursor: "default",
  },

  button: {
    width: "100%",
    backgroundColor: "red",
  },
  buttonNonInteractive: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForeground1,
    cursor: "default",
    pointerEvents: "none",
    hover: "bg-teal-700 transition-all",

    [`& .${buttonClassNames.icon}`]: {
      color: tokens.colorStatusSuccessForeground1,
    },
  },
});

export const LogoutButton = ({
  type,
  text,
  isLoading = false,
  handleClick,
  size = "medium",
  ...props
}: (IButtonSubmit | IButtonButton) & ButtonProps) => {
  const styles = useStyles();

  const buttonContent = isLoading ? "Logging Out..." : text;

  const buttonIcon = isLoading ? <Spinner size="tiny" /> : null;

  const buttonClassName = !isLoading ? undefined : styles.buttonNonInteractive;

  return (
    <div className={styles.wrapper}>
      <FluentProvider theme={webLightTheme}>
        <Button
          type={type}
          appearance="primary"
          className={buttonClassName}
          disabledFocusable={isLoading}
          icon={buttonIcon}
          onClick={handleClick}
          size={size}
          {...props}
        >
          {buttonContent}
        </Button>
      </FluentProvider>

      {isLoading && <Overlay />}
    </div>
  );
};
