import productImage from "@/assets/product-image.png";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import Logo from "@/assets/logosaas.png";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const user = await currentUser();

  if (user) redirect("/");

  return (
    <div className="h-screen flex w-full justify-center">
      <div className="w-[600px] ld:w-full flex flex-col items-start p-6">
        <Image src={Logo} alt="Saas Logo" height={40} width={40} />
        {children}
      </div>
      <div className="hidden lg:flex flex-1 w-full max-h-full max-w-4000px overflow-hidden relative bg-cream  flex-col pt-10 pl-24 gap-3">
        <h2 className="text-gravel md:text-4xl font-bold">
          Hi, I’m your AI powered sales assistant, Corinna!
        </h2>
        <p className="text-iridium md:text-sm mb-10">
          Corinna is capable of capturing lead information without a form...{" "}
          <br />
          something never done before 😉
        </p>
        <Image src={productImage} alt="Product Image" className="mt-10" />
      </div>
    </div>
  );
};

export default Layout;
