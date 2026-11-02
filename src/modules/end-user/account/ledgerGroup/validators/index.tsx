import * as Yup from "yup";

export const LedgerGroupValidator = Yup.object().shape({
  id: Yup.string().required("LedgerGroup id is required"),
  name: Yup.string().required("LedgerGroup name is required"),
  isCustom: Yup.boolean().required("isCustom is required"),
  masterId: Yup.string().required("master is is required"),
  isPrimary: Yup.boolean().required("isPrimary is required"),
});
