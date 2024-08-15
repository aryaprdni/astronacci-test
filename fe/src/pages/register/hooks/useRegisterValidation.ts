// src/hooks/useRegisterValidation.ts
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export const useRegisterValidation = () => {
    const initialValue = {
        email: "",
        password: "",
        name: ""
    }
    const schema = yup.object().shape({
        email: yup.string().email("Invalid email address").required("Email is required"),
        password: yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
        name: yup.string().required("Full Name is required")
    });

    const {
        control,
        handleSubmit,
    } = useForm({
        defaultValues: initialValue,
        resolver: yupResolver(schema),
        mode: "onBlur",
        reValidateMode: "onChange"
    });

    return { control, handleSubmit};
};
