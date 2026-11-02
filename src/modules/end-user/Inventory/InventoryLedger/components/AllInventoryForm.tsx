import { useState, useEffect } from "react";
import { useFilterInventoryByDate } from "../hooks";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import Pagination from "@/hooks/pagination";
import FilterItemByItem from "./FilterItemByItem";
import { EditButton } from "@/components/common/EditButton";
import { IFilterInventoryLedgerByDate, IInventory } from "../types/IInventory";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import GetPriceField from "./GetPriceField";
import GetValueField from "./GetValueField";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { InputElement } from "@/components/FormComponents/input";
import { AppCombobox } from "@/components/common/ComboBox";
import { useGetAllItem } from "../../Item/hooks";
import ItemName from "./ItemName";
type Props = {
  form: UseFormReturn<IFilterInventoryLedgerByDate>;
};
const AllInventoryForm = ({ form }: Props) => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 20,
    pageIndex: 1,
    isPagination: true,
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState<string | null>(null);
  const {
    data: filterInventory,
    refetch,
    isFetching,
    isLoading,
  } = useFilterInventoryByDate(query + (params || ""));
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });

  const [totalQuantity, setTotalQuantity] = useState(0);
  const handleClear = () => {
    refetch();
    form.reset();
    setItemId("");
    setParams("");
  };

  useEffect(() => {
    refetch();
  }, [paginationParams]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState({
    loading: true,
    inventory: [] as IInventory[],
    errorMessage: "",
  });
  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, inventory: [] });
  };
  const handleSubmit = useForm<IFilterInventoryLedgerByDate>({
    defaultValues: {
      itemId: "",
      startDate: "",
      endDate: "",
    },
  });
  const { data: item } = useGetAllItem();
  const [itemId, setItemId] = useState("");
  const handleSelectItem = (itemId: string) => {
    form.setValue("itemId", itemId);
  };
  const [itemValues, setItemValues] = useState<Record<string, number>>({});
  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowPurchase(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  useEffect(() => {
    if (filterInventory) {
      const total = filterInventory?.Items.reduce(
        (sum, item) => sum + item.remainingQuantity,
        0
      );
      setTotalQuantity(total);
    }
  }, [filterInventory]);
  const handleValueCalculated = (itemId: string, value: number) => {
    setItemValues((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };
  const totalValueSum = Object.values(itemValues).reduce(
    (sum, val) => sum + val,
    0
  );

  const onSubmit: SubmitHandler<IFilterInventoryLedgerByDate> = async (
    formData
  ) => {
    try {
      const queryParams = [
        formData.itemId
          ? `itemId=${encodeURIComponent(formData.itemId)}`
          : null,
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";
      setParams(fullQuery);
      await refetch();
      form.reset();
      setItemId("");
    } catch (error) {
      console.error("Error during form submission:", error);
      updateState({
        errorMessage:
          "There was an error fetching the Journal report. Please try again later.",
      });
    }
  };
  return (
    <div className="m-6">
      {isLoading || isFetching ? (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
              <InputElement
                layout="column"
                label="Start Date"
                form={form}
                inputType="date"
                name="startDate"
                placeholder="Enter Start Date"
              />
              <InputElement
                label="End Date"
                form={form}
                inputType="date"
                name="endDate"
                placeholder="Enter End Date"
              />
              <div className="mt-[-1%]">
                {item && (
                  <AppCombobox
                    value={itemId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Item Name"
                    options={item.Items}
                    selected={item.Items.find((g) => g.id === itemId) || null}
                    onSelect={(group) => {
                      if (group) {
                        setItemId(group.id || "");
                        handleSelectItem(group.id || "");
                      } else {
                        setItemId("");
                      }
                    }}
                    getLabel={(g) => g?.name || ""}
                    getValue={(g) => g?.id ?? ""}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4 md:mt-0">
              <ThemeProvider theme={customTheme}>
                <ButtonElement
                  className="flex w-full sm:w-auto"
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "5px 0",
                    borderRadius: "8px",
                  }}
                  type="submit"
                  text="Submit"
                />
              </ThemeProvider>
              <ThemeProvider theme={customTheme}>
                <ButtonElement
                  className="flex w-full sm:w-auto"
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "5px 0",
                    borderRadius: "8px",
                  }}
                  onClick={handleClear}
                  type="button"
                  text="Clear"
                />
              </ThemeProvider>
            </div>
          </form>
          {filterInventory?.Items && filterInventory?.Items.length > 0 ? (
            <div>
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Item")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Price")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Quantity")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Value")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Details")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterInventory?.Items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border text-black">
                        <ItemName itemId={item.itemId} />
                      </td>
                      <td className="p-2 border">
                        <GetPriceField itemId={item.itemId} />
                      </td>
                      <td className="p-2 border">{item.remainingQuantity}</td>
                      <td className="p-2 border">
                        {" "}
                        <GetValueField
                          itemId={item.itemId}
                          onValueCalculated={(value) =>
                            handleValueCalculated(item.itemId, value)
                          }
                        />
                      </td>
                      <td className="p-2 border">
                        <div>
                          <EditButton
                            button={buttonElement(item.itemId ?? "")}
                          />
                        </div>
                        {selectedId && selectedId !== "" && (
                          <FilterItemByItem
                            visible={showPurchase}
                            onClose={() => setShowPurchase(false)}
                            itemId={selectedId}
                          />
                        )}
                      </td>
                    </tr>

                    // <LedgerTable ledgerId={ledger.ledgerId} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {t("Ledger Balance Not Found")}.
            </p>
          )}
          <div>
            {t("Total Quantity")} = {totalQuantity}
          </div>
          <div>
            {t("Total Value")} = {totalValueSum.toFixed(3)}
          </div>
        </div>
      )}

      {filterInventory?.Items && filterInventory?.Items.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(filterInventory)
              ? 1
              : filterInventory?.PageIndex ?? 1,
            firstPage: Array.isArray(filterInventory)
              ? 1
              : filterInventory?.FirstPage ?? 1,
            lastPage: Array.isArray(filterInventory)
              ? 1
              : filterInventory?.LastPage ?? 1,
            nextPage: Array.isArray(filterInventory)
              ? 1
              : filterInventory?.NextPage ?? 1,
            previousPage: Array.isArray(filterInventory)
              ? 1
              : filterInventory?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};
export default AllInventoryForm;
