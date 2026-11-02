import { Spinner } from "@fluentui/react-components";

const Overlay = () => {
  return (
    <div className="fixed z-10 top-0 left-0 bg-black bg-opacity-60 w-screen h-screen">
      <div className="w-full h-full flex justify-center items-center">
        <Spinner size="large" />
      </div>
    </div>
  );
};

export default Overlay;
