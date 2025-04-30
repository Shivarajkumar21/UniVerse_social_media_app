"use client";

import SiginForm from "@/components/ui/siginForm";
import Image from "next/image";
import { useState } from "react";
import HelpModal from "@/components/ui/HelpModal";

const Page = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <main className="flex h-screen w-screen flex-col justify-center gap-4 dark:bg-darkTheme md:flex-row ">
      <div className="flex flex-col items-center justify-center md:-ml-32 md:-mt-20">
        <div className="relative">
          <Image
            src="/_6dd78af8-728b-43b4-9083-9b6eb8bb0017-removebg-preview.png"
            width={300}
            height={300}
            alt="UniVerse logo"
            className="h-40 w-40 md:h-80 md:w-80"
          />
        </div>
        <h1 className="mt-4 text-3xl font-bold">UniVerse</h1>
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <SiginForm formType="signin" />
        <button
          className="mt-4 text-blue-500 underline hover:text-blue-700 font-semibold"
          onClick={() => setHelpOpen(true)}
        >
          Need Help?
        </button>
        <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      </div>
    </main>
  );
};

export default Page;
