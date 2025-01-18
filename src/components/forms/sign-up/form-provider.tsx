"use client";
import { AuthContextProvider } from "@/context/use-auth-context";
import { FormProvider } from "react-hook-form";
import { useSignUpForm } from "@/hooks/sign-up/use-sign-up";
import { Loader } from "@/components/loader";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function SignUpFormProvider({ children }: Props) {
  const { methods, onHandleSubmit, loading } = useSignUpForm();
  return (
    <AuthContextProvider>
      <FormProvider {...methods}>
        <form onSubmit={onHandleSubmit} className="w-full">
          <div className="flex flex-col justify-between gap-3 h-full">
            <Loader loading={loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
    </AuthContextProvider>
  );
}

export default SignUpFormProvider;
