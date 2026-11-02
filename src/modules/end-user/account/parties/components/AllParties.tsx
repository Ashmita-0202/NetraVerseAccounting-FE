import { useEffect, useRef, useState } from "react";
import { useGetAllParties, useGetFilterPartiesByDate } from "../hooks";
import { IParties, IFilterPartiesByDate } from "../types/IParties";
import Pagination from "@/hooks/pagination";
import { useForm } from "react-hook-form";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterPartiesForm from "./FIlterParties";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const AllPartiesForm = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    loading: true,
    parties: [] as IParties[],
    errorMessage: "",
  });

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
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
    updateState({ loading: true, parties: [] });
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allParties, error, refetch } = useGetAllParties(query);
  const tableRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<IFilterPartiesByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterPartiesByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterParties } = useGetFilterPartiesByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Parties, setParties] = useState<
    IPaginationResponse<IParties> | IParties[] | undefined
  >(allParties);
  useEffect(() => {
    if (filterParties && filterParties?.length > 0) {
      setParties(filterParties);
    } else {
      setParties(allParties);
    }
  }, [filterParties, allParties]);

  const getPartiesArray = (): IParties[] => {
    if (Parties && "Items" in Parties) {
      return Parties.Items;
    } else if (Array.isArray(Parties)) {
      return Parties;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      parties: getPartiesArray(),
      errorMessage: error ? "Failed to fetch Parties" : "",
    });
  }, [Parties, error]);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

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
      {(allParties?.Items || []).length > 0 && (
        <FilterPartiesForm form={form} setFormData={setFormData} />
      )}

      <div ref={tableRef}>
        {state.parties.length > 0 ? (
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
                  {t("Address")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("PAN No")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Phone Number")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Maximum Credit Period")}
                </th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">
                  {t("Maximum Due Period")}
                </th>
              </tr>
            </thead>
            <tbody>
              {state.parties.map((parties: IParties, index: number) => (
                <tr
                  key={index}
                  className="text-center even:bg-gray-100 text-xs sm:text-sm lg:text-base"
                >
                  <td className="p-2 sm:p-3 border-b">{index + 1}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {parties.name}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {parties.address}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {parties.panNo}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {parties.phoneNumber}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {parties.maxCreditPeriod}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {parties.maxDuePeriod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-sm text-gray-500">No parties found.</p>
        )}
      </div>

      {state.parties.length > 0 && (
        <div className="mt-4">
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(Parties) ? 1 : Parties?.PageIndex ?? 1,
              firstPage: Array.isArray(Parties) ? 1 : Parties?.FirstPage ?? 1,
              lastPage: Array.isArray(Parties) ? 1 : Parties?.LastPage ?? 1,
              nextPage: Array.isArray(Parties) ? 1 : Parties?.NextPage ?? 1,
              previousPage: Array.isArray(Parties)
                ? 1
                : Parties?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        </div>
      )}
    </div>
  );
};

export default AllPartiesForm;
