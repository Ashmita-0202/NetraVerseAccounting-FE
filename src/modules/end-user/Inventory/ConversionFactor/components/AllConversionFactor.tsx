import { useEffect, useState } from "react";
import {
  useGetAllConversionFactor,
  useRemoveConversionFactor,
  useGetFilterConversionFactorByDate,
} from "../hooks";
import { IConversionFactor } from "../types/IConversionFactor";
import Pagination from "@/hooks/pagination";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import EditConversionFactor from "../pages/Edit";

import { useGetUnitsById } from "../../Units/hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { IFilterConversionFactorByDate } from "../types/IConversionFactor";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterConversionFactorForm from "./FilterConversionFactor";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllConversionFactorForm = () => {
  const { t } = useTranslation();
  const form = useForm<IFilterConversionFactorByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      formUnit: "",
    },
  });
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 5,
    pageIndex: 1,
    isPagination: true,
  });
  const [state, setState] = useState({
    loading: true,
    ConversionFactor: [] as IConversionFactor[],
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
    updateState({ loading: true, ConversionFactor: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;

  const {
    data: allConversionFactor,
    error,
    isLoading: conversionFactorLoading,
    refetch,
  } = useGetAllConversionFactor(query);
  const { mutate: deleteConversionFactor } = useRemoveConversionFactor();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const [formData, setFormData] = useState<IFilterConversionFactorByDate>({
    startDate: "",
    endDate: "",
    formUnit: "",
  });
  const { data: filterConversionFactor } = useGetFilterConversionFactorByDate(
    formData.startDate,
    formData.endDate,
    formData.formUnit
  );
  const [ConversionFactor, setConversionFactor] = useState<
    IPaginationResponse<IConversionFactor> | IConversionFactor[] | undefined
  >(allConversionFactor);
  useEffect(() => {
    if (filterConversionFactor && filterConversionFactor?.length > 0) {
      setConversionFactor(filterConversionFactor);
    } else {
      setConversionFactor(allConversionFactor);
    }
  }, [filterConversionFactor, allConversionFactor]);

  const getConversionFactorArray = (): IConversionFactor[] => {
    if (ConversionFactor && "Items" in ConversionFactor) {
      return ConversionFactor.Items;
    } else if (Array.isArray(ConversionFactor)) {
      return ConversionFactor;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      ConversionFactor: getConversionFactorArray(),
      errorMessage: error ? "Failed to fetch ConversionFactor" : "",
    });
  }, [ConversionFactor, error]);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleDelete = (id: string | undefined) => {
    deleteConversionFactor(id, {
      onSuccess: () => {
        refetch();
      },
      onError: () => {
        alert("Failed to delete ConversionFactor.");
      },
    });
  };
  const buttonElement = (id: string | undefined) => {
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

  const GetUnitName = ({ unitId }: { unitId: string }) => {
    const { data: unitData, isLoading } = useGetUnitsById(unitId);
    if (isLoading) return <span>Loading...</span>;
    if (!unitData) return <span>Unknown Unit</span>;

    return <span>{unitData.name}</span>;
  };

  useEffect(() => {
    if (selectedId) {
      setShowModal(true);
    }
  }, [selectedId]);
  return (
    <div className="p-4">
      {conversionFactorLoading && (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      {/* {(allConversionFactor?.Items || []).length > 0 && ( */}
      <FilterConversionFactorForm form={form} setFormData={setFormData} />
      {/* )} */}
      <div className="">
        {state.ConversionFactor.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("SN")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Conversion Name")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("From Unit")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("To Unit")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Conversion Factor")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {state.ConversionFactor.map(
                (ConversionFactor: IConversionFactor, index: number) => (
                  <tr
                    key={index}
                    className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                  >
                    <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {ConversionFactor.name}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      <GetUnitName unitId={ConversionFactor.fromUnit} />
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      <GetUnitName unitId={ConversionFactor.toUnit} />
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {ConversionFactor.conversionFactor}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      <div className="flex space-x-2 items-center justify-center">
                        {canDelete && (
                          <div>
                            <DeleteButton
                              handleDelete={() =>
                                handleDelete(ConversionFactor.id)
                              }
                              isLoading={conversionFactorLoading}
                            />
                          </div>
                        )}
                        {canEdit && (
                          <div>
                            <EditButton
                              button={buttonElement(ConversionFactor.id)}
                            />
                          </div>
                        )}

                        {selectedId && selectedId !== "" && (
                          <EditConversionFactor
                            visible={showModal}
                            onClose={() => setShowModal(false)}
                            ConversionFactorId={selectedId}
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
            No ConversionFactor found.
          </p>
        )}
      </div>

      {state.ConversionFactor.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(ConversionFactor)
                ? 1
                : ConversionFactor?.PageIndex ?? 1,
              firstPage: Array.isArray(ConversionFactor)
                ? 1
                : ConversionFactor?.FirstPage ?? 1,
              lastPage: Array.isArray(ConversionFactor)
                ? 1
                : ConversionFactor?.LastPage ?? 1,
              nextPage: Array.isArray(ConversionFactor)
                ? 1
                : ConversionFactor?.NextPage ?? 1,
              previousPage: Array.isArray(ConversionFactor)
                ? 1
                : ConversionFactor?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        </div>
      )}
    </div>
  );
};

export default AllConversionFactorForm;
