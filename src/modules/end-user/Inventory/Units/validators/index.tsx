import * as Yup from "yup";

export const UnitsValidator = Yup.object().shape({
  id: Yup.number().required("Units id is required"),
  name: Yup.string().required("Units name is required"),
  createdAt: Yup.string().required("Created At is required"),
  userId: Yup.string().required("userId is is required"),
  updatedAt: Yup.string().required("Updated At is required"),
  updatedBy: Yup.string().required("Updated By is required"),
  isEnable: Yup.boolean().required("Is Enable is required"),
});
