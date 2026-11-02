import { useEffect, useState } from "react";
import { IInstitution } from "../types/IInstitution";
import { useGetAllInstitution, useGetFilterInstitutionByDate } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Pagination from "@/hooks/pagination";
import { EditButton } from "@/components/common/EditButton";
import EditInstitution from "../pages/Edit";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useRemoveInstitution } from "../hooks";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import { IFilterInstitutionByDate } from "../types/IInstitution";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterInstitutionForm from "./FIlterInstitutionForm";
const AllInstitutionForm = () => {
  const [modal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<string>("");

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

  const [state, setState] = useState({
    loading: true,
    institutions: [] as IInstitution[],
    errorMessage: "",
  });
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 5,
    pageIndex: 1,
    isPagination: true,
  });
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const query = `?pagesize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allInstitution, error, refetch } = useGetAllInstitution(query);

  const form = useForm<IFilterInstitutionByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterInstitutionByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterInstitution } = useGetFilterInstitutionByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Institution, setInstitution] = useState<
    IPaginationResponse<IInstitution> | IInstitution[] | undefined
  >(allInstitution);
  useEffect(() => {
    if (filterInstitution && filterInstitution?.length > 0) {
      setInstitution(filterInstitution);
    } else {
      setInstitution(allInstitution);
    }
  }, [filterInstitution, allInstitution]);

  const getInstitutionArray = (): IInstitution[] => {
    if (Institution && "Items" in Institution) {
      return Institution.Items;
    } else if (Array.isArray(Institution)) {
      return Institution;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      institutions: getInstitutionArray(),
      errorMessage: error ? "Failed to fetch Institution" : "",
    });
  }, [Institution, error]);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const deleteInstitution = useRemoveInstitution();

  const handleDelete = async (id: string | undefined) => {
    setIsLoading(true);
    try {
      await deleteInstitution.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, institutions: [] });
  };

  return (
    <div
      style={{
        margin: "20px",
      }}
      className="p-4"
    >
      {error && <p style={{ color: "red" }}>{error.message}</p>}

      {(allInstitution?.Items || []).length > 0 && (
        <FilterInstitutionForm form={form} setFormData={setFormData} />
      )}

      <table
        className="w-full border-collapse mb-4 "
        style={{
          minWidth: "600px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              SN
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Name
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Address
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Email
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Short Name
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Contact Number
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Contact Person
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Pan
            </th>

            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {state?.institutions?.length > 0 ? (
            state?.institutions?.map(
              (institution: IInstitution, index: number) => (
                <tr key={index}>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                    className="break-words"
                  >
                    {institution.name}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {institution.address}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                    className="break-words"
                  >
                    {institution.email}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {institution.shortName}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {institution.contactNumber}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {institution.contactPerson}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {institution.pan}
                  </td>

                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    <div className="flex space-x-2">
                      <DeleteButton
                        handleDelete={() => handleDelete(institution.id)}
                        isLoading={isLoading}
                      />
                      <EditButton
                        button={buttonElement(institution.id ?? "")}
                      />

                      {selectedId && selectedId !== "" && (
                        <EditInstitution
                          visible={modal}
                          onClose={() => setShowModal(false)}
                          institutionId={selectedId}
                          currentPageIndex={paginationParams.pageIndex}
                          organizationId={institution.organizationId}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: "12px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              ></td>
            </tr>
          )}
        </tbody>
      </table>

      {state?.institutions?.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: Array.isArray(Institution)
              ? 1
              : Institution?.PageIndex ?? 1,
            firstPage: Array.isArray(Institution)
              ? 1
              : Institution?.FirstPage ?? 1,
            lastPage: Array.isArray(Institution)
              ? 1
              : Institution?.LastPage ?? 1,
            nextPage: Array.isArray(Institution)
              ? 1
              : Institution?.NextPage ?? 1,
            previousPage: Array.isArray(Institution)
              ? 1
              : Institution?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};
export default AllInstitutionForm;
