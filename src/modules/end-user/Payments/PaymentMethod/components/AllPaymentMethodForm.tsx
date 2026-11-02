import { useEffect, useState } from "react";
import {
  useGetAllPaymentMethod,
  useRemovePaymentMethod,
  useGetFilterPaymentMethodByDate,
} from "../hooks";
import {
  IPaymentMethod,
  IFilterPaymentMethodByDate,
} from "../types/IPaymentMethod";
import Pagination from "@/hooks/pagination";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterPaymentMethodForm from "./FilterPaymentMethodForm";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import EditPaymentMethod from "../pages/Edit";
// import { usePermissions } from "@/context/auth/PermissionContext";
// import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllPaymentMethodForm = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    loading: true,
    PaymentMethod: [] as IPaymentMethod[],
    errorMessage: "",
  });

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 20,
    pageIndex: 1,
    isPagination: true,
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
    updateState({ loading: true, PaymentMethod: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const {
    data: allPaymentMethod,
    error,
    refetch,
    isLoading: paymentLoading,
    isFetching,
  } = useGetAllPaymentMethod(query);
  const { mutate: deletePaymentMethod } = useRemovePaymentMethod();
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  // const { menuStatus } = usePermissions();
  // const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const form = useForm<IFilterPaymentMethodByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterPaymentMethodByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterPaymentMethod } = useGetFilterPaymentMethodByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [PaymentMethod, setPaymentMethod] = useState<
    IPaginationResponse<IPaymentMethod> | IPaymentMethod[] | undefined
  >(allPaymentMethod);
  useEffect(() => {
    if (filterPaymentMethod && filterPaymentMethod?.length > 0) {
      setPaymentMethod(filterPaymentMethod);
    } else {
      setPaymentMethod(allPaymentMethod);
    }
  }, [filterPaymentMethod, allPaymentMethod]);

  const getPaymentMethodArray = (): IPaymentMethod[] => {
    if (PaymentMethod && "Items" in PaymentMethod) {
      return PaymentMethod.Items;
    } else if (Array.isArray(PaymentMethod)) {
      return PaymentMethod;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      PaymentMethod: getPaymentMethodArray(),
      errorMessage: error ? "Failed to fetch PaymentMethod" : "",
    });
  }, [PaymentMethod, error]);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this PaymentMethod?")) {
      deletePaymentMethod(id, {
        onSuccess: () => {
          refetch();
        },
        onError: () => {
          alert("Failed to delete PaymentMethod.");
        },
      });
    }
  };
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowModal(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  useEffect(() => {
    if (selectedId) {
      setShowModal(true);
    }
  }, [selectedId]);
  return (
    <div className="p-4">
      {paymentLoading || isFetching ? (
        <div className="relative" style={{ minHeight: "50rem" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        </div>
      ) : (
        <div>
          {state.loading && (
            <p className="text-center text-blue-600">Loading...</p>
          )}
          {state.errorMessage && (
            <p className="text-center text-red-500">{state.errorMessage}</p>
          )}
          {(allPaymentMethod?.Items || []).length > 0 && (
            <FilterPaymentMethodForm form={form} setFormData={setFormData} />
          )}
          <div className="">
            {state.PaymentMethod.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-200 text-sm sm:text-base">
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("SN")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Name")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Ledger")}
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2">
                      {t("Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.PaymentMethod.map(
                    (PaymentMethod: IPaymentMethod, index: number) => (
                      <tr
                        key={index}
                        className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                      >
                        <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                        <td className="border border-gray-300 px-2 sm:px-4 py-2">
                          {PaymentMethod.name}
                        </td>

                        <td className="border border-gray-300 px-2 sm:px-4 py-2">
                          <LedgerGroupName
                            ledgerGroupId={PaymentMethod.ledgerGroupId}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 sm:px-4 py-2">
                          <div className="flex space-x-2 items-center justify-center">
                            {/* {canDelete && ( */}
                            <div>
                              <DeleteButton
                                handleDelete={() =>
                                  handleDelete(PaymentMethod.id)
                                }
                                isLoading={isLoading}
                              />
                            </div>
                            {/* )}
                      {canEdit && ( */}
                            <div>
                              <EditButton
                                button={buttonElement(PaymentMethod.id)}
                              />
                            </div>
                            {/* )} */}

                            {selectedId && selectedId !== "" && (
                              <EditPaymentMethod
                                visible={showModal}
                                onClose={() => setShowModal(false)}
                                unitsId={selectedId}
                                currentPageIndex={paginationParams.pageIndex}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-sm text-gray-500">
                {t("No Payment Method found")}.
              </p>
            )}
          </div>

          {state.PaymentMethod.length > 0 && (
            <div className="mt-4">
              <Pagination
                form={handleSubmit}
                pagination={{
                  currentPage: Array.isArray(PaymentMethod)
                    ? 1
                    : PaymentMethod?.PageIndex ?? 1,
                  firstPage: Array.isArray(PaymentMethod)
                    ? 1
                    : PaymentMethod?.FirstPage ?? 1,
                  lastPage: Array.isArray(PaymentMethod)
                    ? 1
                    : PaymentMethod?.LastPage ?? 1,
                  nextPage: Array.isArray(PaymentMethod)
                    ? 1
                    : PaymentMethod?.NextPage ?? 1,
                  previousPage: Array.isArray(PaymentMethod)
                    ? 1
                    : PaymentMethod?.PreviousPage ?? 1,
                }}
                handleSearch={handleSearch}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllPaymentMethodForm;
