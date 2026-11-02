import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";

const PaymentSettingsForm = () => {
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  return (
    <div className=" w-full mx-auto  rounded-xl p-6">
      <form>
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          Payment Settings
        </h1>
        <div className="flex  w-[51.5%] pb-6 border-b-2 border-gray-200 border-solid">
          <div className="flex py-2 items-center justify-between w-full">
            <label className="text-gray-700">Show Serial Number</label>
            <input type="checkbox" className="w-4 h-4 accent-teal-500" />
          </div>
        </div>

        <div className="flex mt-6 space-x-3">
          <ThemeProvider theme={customTheme}>
            <ButtonElement
              style={{
                backgroundColor: customTheme.palette.themePrimary,
                padding: "8px 16px",
                borderRadius: "8px",
              }}
              type="submit"
              className="text-white font-medium transition hover:bg-teal-700"
              text="Change"
              // text={isSubmitting ? "Saving..." : "Change"}
              // disabled={isSubmitting}
            />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
};

export default PaymentSettingsForm;
