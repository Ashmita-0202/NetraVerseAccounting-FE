import * as Yup from "yup";

export const ExpensesValidator = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  date: Yup.string().required("date is required"),
  billNumber: Yup.string().required("billNumber is required"),
  ledgerId: Yup.string().required("LedgerId  is required"),
  discountPercent: Yup.string().required("discountpercent is required"),
  vatPercent: Yup.string().required("VatPercent is required"),
});
