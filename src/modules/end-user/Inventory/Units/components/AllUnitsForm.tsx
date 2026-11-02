import { useEffect, useState } from "react";
import {
  useGetAllUnits,
  useRemoveUnits,
  useGetFilterUnitsByDate,
} from "../hooks";
import { IUnits } from "../types/IUnits";
import Pagination from "@/hooks/pagination";
import { IFilterUnitsByDate } from "../types/IUnits";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterUnitsForm from "./FilterUnitsForm";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/common/EditButton";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import EditUnits from "../pages/Edit";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/modules/admin/rolesmodules/hooks/useMenuPermissionData";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
const AllUnitsForm = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    loading: true,
    Units: [] as IUnits[],
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
    updateState({ loading: true, Units: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allUnits, error, refetch } = useGetAllUnits(query);
  const { mutate: deleteUnits } = useRemoveUnits();
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus);
  const form = useForm<IFilterUnitsByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterUnitsByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterUnits } = useGetFilterUnitsByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Units, setUnits] = useState<
    IPaginationResponse<IUnits> | IUnits[] | undefined
  >(allUnits);
  useEffect(() => {
    if (filterUnits && filterUnits?.length > 0) {
      setUnits(filterUnits);
    } else {
      setUnits(allUnits);
    }
  }, [filterUnits, allUnits]);

  const getUnitsArray = (): IUnits[] => {
    if (Units && "Items" in Units) {
      return Units.Items;
    } else if (Array.isArray(Units)) {
      return Units;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      Units: getUnitsArray(),
      errorMessage: error ? "Failed to fetch Units" : "",
    });
  }, [Units, error]);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Units?")) {
      deleteUnits(id, {
        onSuccess: () => {
          refetch();
        },
        onError: () => {
          alert("Failed to delete Units.");
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
      {state.loading && (
        <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
      {state.errorMessage && (
        <p className="text-center text-red-500">{state.errorMessage}</p>
      )}
      {(allUnits?.Items || []).length > 0 && (
        <FilterUnitsForm form={form} setFormData={setFormData} />
      )}
      <div className="">
        {state.Units.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("SN")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Unit Name")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Is Enabled")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {state.Units.map((Units: IUnits, index: number) => (
                <tr
                  key={index}
                  className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                >
                  <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {Units.name}
                  </td>

                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {Units.isEnabled ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    <div className="flex space-x-2 items-center justify-center">
                      {canDelete && (
                        <div>
                          <DeleteButton
                            handleDelete={() => handleDelete(Units.id)}
                            isLoading={isLoading}
                          />
                        </div>
                      )}
                      {canEdit && (
                        <div>
                          <EditButton button={buttonElement(Units.id)} />
                        </div>
                      )}

                      {selectedId && selectedId !== "" && (
                        <EditUnits
                          visible={showModal}
                          onClose={() => setShowModal(false)}
                          unitsId={selectedId}
                          currentPageIndex={paginationParams.pageIndex}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-sm text-gray-500">No Units found.</p>
        )}
      </div>

      {state.Units.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(Units) ? 1 : Units?.PageIndex ?? 1,
              firstPage: Array.isArray(Units) ? 1 : Units?.FirstPage ?? 1,
              lastPage: Array.isArray(Units) ? 1 : Units?.LastPage ?? 1,
              nextPage: Array.isArray(Units) ? 1 : Units?.NextPage ?? 1,
              previousPage: Array.isArray(Units) ? 1 : Units?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        </div>
      )}
    </div>
  );
};

export default AllUnitsForm;
