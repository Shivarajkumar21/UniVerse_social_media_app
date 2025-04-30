"use client";

import StudentSignupForm from "@/components/ui/studentSignupForm";
import { useState } from "react";
import HelpModal from "@/components/ui/HelpModal";

const Page = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <main className="flex h-screen w-screen flex-col justify-center gap-4 dark:bg-darkTheme md:flex-row ">
      <div className="relative flex flex-col items-center justify-center w-full">
        <StudentSignupForm />
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
