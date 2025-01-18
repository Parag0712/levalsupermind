import { USER_REGISTRATION_FORM } from "@/constants/form";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import FormGenerator from "../form-generator";
import React from "react";

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

function AccountDetailsForm({ errors, register }: Props) {
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold">Account details</h2>
      <p className="text-iridium md:text-sm">
        Create your account by entering email and password
      </p>
      {USER_REGISTRATION_FORM.map((field) => (
        <FormGenerator
          key={field.id}
          {...field}
          errors={errors}
          register={register}
          name={field.name}
        />
      ))}
    </>
  );
}

export default AccountDetailsForm;
