/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonElement } from "@/components/FormComponents/Button";

type PaginationProps = {
  handleSearch: (values: any) => void; // no question mark here
  pagination: {
    lastPage?: number;
    firstPage?: number;
    currentPage?: number;
    nextPage?: number;
    previousPage?: number;
  };
  form: any;
};

const Pagination = ({ handleSearch, pagination, form }: PaginationProps) => {
  const onPageChange = (pageIndex: number | undefined) => {
    if (pageIndex !== undefined) {
      form.setValue("pageIndex", pageIndex);
      form.setValue("isPagination", true);
      form.handleSubmit(handleSearch(form.getValues()));
    }
  };

  return (
    <div className="container flex mt-3 justify-center">
      <div className="flex gap-1">
        <ButtonElement
          shape="square"
          disabled={pagination.currentPage === pagination.firstPage}
          text="First Page"
          type="button"
          handleClick={() => onPageChange(pagination.firstPage)}
        />

        <ButtonElement
          shape="square"
          appearance="primary"
          disabled={pagination.currentPage === pagination.lastPage}
          text="Next Page"
          type="button"
          handleClick={() => onPageChange(pagination.nextPage)}
        />

        <ButtonElement
          shape="square"
          appearance="primary"
          disabled={pagination.currentPage === pagination.lastPage}
          text="Last Page"
          type="button"
          handleClick={() => onPageChange(pagination.lastPage)}
        />
      </div>
    </div>
  );
};

export default Pagination;
