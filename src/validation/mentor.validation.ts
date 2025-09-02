import { object, string } from "yup";
import { IMentorProps } from "../interface";

export const initialMentorValues: IMentorProps = {
  accountStatus: {
    block: false,
    online: false,
    verification: true,
  },
  acType: "MENTOR",
  auth: {
    password: "",
    username: "",
  },
  category: [],
  contact: {
    address: "", //
    email: "", //
    mobile: "", //
  },
  image: "",
  languages: [],
  name: {
    firstName: "", //
    lastName: "", //
  },
  qualification: "",
  specialists: [],
  status: true,
  description: "",
  videoLink: "",
};

export const MentorValidationSchema = object().shape({
  username: string().required("username is required"),
  password: string().required("password is required"),
  category: string().required("category is required"),
  email: string().email("email is not valid").required("email is required"),
  mobile: string().required("mobile is required"),
  address: string().required("address is required"),
  firstName: string().required("first name is required"),
  lastName: string().required("last name is required"),
  specialists: string().required("specialist is required"),
  languages: string().required("specialist is required"),
  image: string().required("image is required"),
});
