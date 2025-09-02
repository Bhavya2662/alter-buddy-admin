import { object, string } from "yup";
import { ISignInProps } from "../interface";

export const SignInValidationValue: ISignInProps = {
     email: "",
     password: "",
};

export const SignInSchema = object().shape({
     email: string().email("email is not valid").required("email address is required"),
     password: string().required("password is required"),
});
