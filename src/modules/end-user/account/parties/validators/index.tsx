import * as Yup from "yup";

export const LedgerValidator = Yup.object().shape({
  name: Yup.string().required("Ledger name is required"),
  isInventoryAffected: Yup.boolean().required(
    "Inventory affected status is required"
  ),
  address: Yup.string().required("Address is required"),
  panNo: Yup.string().optional(),
  salesTaxNo: Yup.string().optional(),
});
