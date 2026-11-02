import { useEffect, useState } from "react";
import { ICompany } from "../types/ICompany";
import { useGetAllCompany, useGetFilterCompanyByDate } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Pagination from "@/hooks/pagination";
import { EditButton } from "@/components/common/EditButton";
import EditCompany from "../pages/Edit";
import { DeleteButton } from "@/components/common/DeleteButton";
import { useRemoveCompany } from "../hooks";
import { ButtonElement } from "@/components/FormComponents/Button";
import { Edit } from "lucide-react";
import { IFilterCompanyByDate } from "../types/ICompany";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import FilterCompanyForm from "./FilterCompanyByDate";
const AllCompanyForm = () => {
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
    Company: [] as ICompany[],
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
  const { data: allCompany, error, refetch } = useGetAllCompany(query);

  const form = useForm<IFilterCompanyByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
  });
  const [formData, setFormData] = useState<IFilterCompanyByDate>({
    startDate: "",
    endDate: "",
    name: "",
  });
  const { data: filterCompany } = useGetFilterCompanyByDate(
    formData.startDate,
    formData.endDate,
    formData.name
  );
  const [Company, setCompany] = useState<
    IPaginationResponse<ICompany> | ICompany[] | undefined
  >(allCompany);
  useEffect(() => {
    if (filterCompany && filterCompany?.length > 0) {
      setCompany(filterCompany);
    } else {
      setCompany(allCompany);
    }
  }, [filterCompany, allCompany]);

  const getCompanyArray = (): ICompany[] => {
    if (Company && "Items" in Company) {
      return Company.Items;
    } else if (Array.isArray(Company)) {
      return Company;
    }
    return [];
  };

  useEffect(() => {
    setState({
      loading: false,
      Company: getCompanyArray(),
      errorMessage: error ? "Failed to fetch Company" : "",
    });
  }, [Company, error]);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const deleteCompany = useRemoveCompany();

  const handleDelete = async (id: string | undefined) => {
    setIsLoading(true);
    try {
      await deleteCompany.mutateAsync(id); // Perform the delete operation
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
  }, [paginationParams]);

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
    updateState({ loading: true, Company: [] });
  };

  return (
    <div className="m-[20px]">
      {(allCompany?.Items || []).length > 0 && (
        <FilterCompanyForm form={form} setFormData={setFormData} />
      )}
      <div
        style={{
          margin: "20px",
          overflowX: "auto",
        }}
        className="p-4"
      >
        {error && <p style={{ color: "red" }}>{error.message}</p>}

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
            {state?.Company?.length > 0 ? (
              state?.Company?.map((Company: ICompany, index: number) => (
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
                    {Company.name}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {Company.address}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                    className="break-words"
                  >
                    {Company.email}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {Company.shortName}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {Company.contactNumber}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {Company.contactPerson}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                    className="break-words"
                  >
                    {Company.pan}
                  </td>

                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    <div className="flex space-x-2">
                      <DeleteButton
                        handleDelete={() => handleDelete(Company.id)}
                        isLoading={isLoading}
                      />
                      <EditButton button={buttonElement(Company.id ?? "")} />

                      {selectedId && selectedId !== "" && (
                        <EditCompany
                          visible={modal}
                          onClose={() => setShowModal(false)}
                          CompanyId={selectedId}
                          currentPageIndex={paginationParams.pageIndex}
                          institutionId={Company.institutionId}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
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

        {state?.Company?.length > 0 && (
          <Pagination
            form={handleSubmit}
            pagination={{
              currentPage: Array.isArray(Company) ? 1 : Company?.PageIndex ?? 1,
              firstPage: Array.isArray(Company) ? 1 : Company?.FirstPage ?? 1,
              lastPage: Array.isArray(Company) ? 1 : Company?.LastPage ?? 1,
              nextPage: Array.isArray(Company) ? 1 : Company?.NextPage ?? 1,
              previousPage: Array.isArray(Company)
                ? 1
                : Company?.PreviousPage ?? 1,
            }}
            handleSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
};
export default AllCompanyForm;
