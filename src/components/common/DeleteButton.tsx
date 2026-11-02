import Swal from "sweetalert2";
import { ButtonElement } from "../FormComponents/Button";
import { Trash } from "lucide-react";
import { makeStyles } from "@fluentui/react-components";
import { useEffect } from "react";

interface Props {
  handleDelete: () => void;
  isLoading: boolean;
}

const useStyles = makeStyles({
  swalSmallConfirmBtn: {
    fontSize: "14px !important",
    padding: "5px 10px !important",
    borderRadius: "5px !important",
    backgroundColor: "#3085d6 !important",
    color: "white !important",
  },
  swalSmallCancelBtn: {
    fontSize: "14px !important",
    padding: "5px 10px !important",
    borderRadius: "5px !important",
    backgroundColor: "#d33 !important",
    color: "white !important",
  },
});

export const DeleteButton: React.FC<Props> = ({ handleDelete, isLoading }) => {
  const styles = useStyles();

  const showLoading = () => {
    Swal.fire({
      title: "Deleting",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  };

  const alert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",

      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: styles.swalSmallConfirmBtn,
        cancelButton: styles.swalSmallCancelBtn,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        showLoading();
        handleDelete();
        Swal.close();
      }
    });
  };
  useEffect(() => {
    if (!isLoading) {
      Swal.close();
    }
  }, [isLoading]);

  return (
    <ButtonElement
      icon={<Trash color="white" size={14} />}
      text=""
      type="button"
      disabled={isLoading}
      onClick={() => {
        alert();
      }}
      className="!text-[10px] font-bold !px-3 !py-1 !bg-red-500 !hover:bg-transparent border border-red-500 rounded-md"
    />
  );
};
