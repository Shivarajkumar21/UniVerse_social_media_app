"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { LiaSpinnerSolid } from "react-icons/lia";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormType = "signin" | "signup";

const SiginForm = ({ formType }: { formType: FormType }) => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  const router = useRouter();
  const { data: session } = useSession();

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      await axios.post("/api/auth/send-otp", { email: userInput.email });
      setShowOtpInput(true);
      setCountdown(600); // Reset countdown to 10 minutes
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      await axios.post("/api/auth/verify-otp", {
        email: userInput.email,
        code: otp,
      });
      setShowOtpInput(false);
      toast.success("OTP verified successfully");
      return true;
    } catch (error) {
      toast.error("Invalid OTP");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formType === "signin" && userInput.email && userInput.password) {
      if (!showOtpInput) {
        // First verify credentials
        const { email, password } = userInput;
        const user = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (!user?.url) {
          toast.error("Email or password is incorrect");
          return;
        }
        // If credentials are correct, send OTP
        await handleSendOtp();
      } else {
        // Verify OTP
        const isOtpValid = await handleVerifyOtp();
        if (isOtpValid) {
          // If OTP is valid, complete sign in
          const { email, password } = userInput;
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          
          if (result?.ok) {
            // Check if user needs to complete profile setup
            try {
              const response = await axios.get("/api/users/check-profile");
              if (!response.data.hasProfile) {
                router.push("/setup-profile");
              } else {
                router.push("/home");
              }
            } catch (error) {
              router.push("/home");
            }
          }
        }
      }
    } else if (
      formType === "signup" &&
      userInput.name &&
      userInput.password &&
      userInput.email
    ) {
      if (!showOtpInput) {
        // First send OTP
        await handleSendOtp();
      } else {
        // Verify OTP
        const isOtpValid = await handleVerifyOtp();
        if (isOtpValid) {
          // If OTP is valid, complete sign up
          toast
            .promise(axios.put("/api/users/signup", userInput), {
              loading: "Creating new account...",
              success: <p>Successfully created account</p>,
              error: (
                <p>
                  Account with email <b>"{userInput.email}"</b> already exists
                </p>
              ),
            })
            .then((resp) => {
              if (resp.data === "Created New Account") {
                router.push("/signin");
              }
            });
        }
      }
    } else toast.error("Fill all details");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-2">
      <form
        className="flex flex-col items-center justify-center gap-4 p-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        {formType === "signup" && (
          <input
            type="text"
            className="min-w-0 rounded-lg border-2 border-darkGray bg-transparent p-2"
            placeholder="Full Name"
            value={userInput.name}
            onChange={(e) =>
              setUserInput((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
          />
        )}
        <input
          type="email"
          className="min-w-0 rounded-lg border-2 border-darkGray bg-transparent p-2"
          placeholder="Email"
          value={userInput.email}
          onChange={(e) =>
            setUserInput((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
        />
        <input
          type="password"
          className="min-w-0 rounded-lg border-2 border-darkGray bg-transparent p-2"
          placeholder="Password"
          value={userInput.password}
          onChange={(e) =>
            setUserInput((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
        {showOtpInput && (
          <>
            <input
              type="text"
              className="min-w-0 rounded-lg border-2 border-darkGray bg-transparent p-2"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              <p>Code expires in {formatTime(countdown)}</p>
            </div>
          </>
        )}
        <button
          type="submit"
          className="mt-4 rounded-lg bg-lightGray p-2 px-14 font-semibold dark:bg-darkGray md:w-full"
          disabled={isVerifying || isSendingOtp}
        >
          {isVerifying || isSendingOtp ? (
            <span className="flex items-center justify-center">
              <LiaSpinnerSolid className="animate-spin" />
            </span>
          ) : showOtpInput ? (
            "Verify OTP"
          ) : formType === "signup" ? (
            "Create Account"
          ) : (
            "Sign in"
          )}
        </button>
      </form>
      <p className="-my-3 text-xl font-semibold">or</p>
      <button
        className="flex items-center gap-2 rounded-md bg-extraLightGray p-2 font-bold shadow-xl dark:bg-lightTheme dark:text-darkTheme md:w-full"
        onClick={() => signIn("google")}
      >
        <FcGoogle />
        {formType === "signup" ? "Sign Up" : "Sign in"} with Google
      </button>
      <p>
        {formType === "signup"
          ? "Already have an account, "
          : "Don't have an Account , "}

        <Link
          href={formType === "signup" ? "/signin" : "/signup"}
          className="text-blue-500 underline dark:text-blue-300"
        >
          {formType === "signup" ? "Sign in" : "sign up"}
        </Link>
      </p>
    </div>
  );
};

export default SiginForm;
