import * as yup from "yup";

export const RegisterValidator = yup.object().shape({
  firstName: yup.string().required("पहिलो नाम आवश्यक छ"),
  middleName: yup.string(),
  lastName: yup.string().required("थर आवश्यक छ"),
  username: yup.string().required("प्रयोगकर्ताको नाम आवश्यक छ"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "फोन नम्बर १० अंकको हुनुपर्छ")
    .required("फोन नम्बर आवश्यक छ"),
  email: yup
    .string()
    .email("मान्य इमेल ठेगाना आवश्यक छ")
    .required("इमेल आवश्यक छ"),
  password: yup
    .string()
    .required("पासवर्ड आवश्यक छ")
    .min(8, "पासवर्ड कम्तिमा ८ अक्षरको हुनुपर्छ"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "पासवर्ड मिल्नुपर्छ")
    .required("पासवर्ड पुष्टि आवश्यक छ"),
  role: yup.string(),
});
