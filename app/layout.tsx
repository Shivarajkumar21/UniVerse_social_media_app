import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AllProviders from "@/components/allProviders";
import RenderPages from "@/components/renderPages";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniVerse",
  description: "Your University's Social Universe",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ]
  }
};

export default function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-lightTheme text-darkTheme dark:bg-darkTheme dark:text-lightTheme`}
      >
        <AllProviders>
          <RenderPages>
            {props.children}
            {props.modal}
          </RenderPages>
        </AllProviders>
      </body>
    </html>
  );
}
