"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const StudentSignupForm = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    usn: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      // First check if the email and USN are pre-approved
      const preApprovalCheck = await axios.post("/api/auth/check-preapproved", {
        email: userInput.email,
        usn: userInput.usn,
      });

      if (!preApprovalCheck.data.isApproved) {
        toast.error("Email and USN do not match our records");
        return;
      }

      // If pre-approved, send OTP
      await axios.post("/api/auth/send-otp", { email: userInput.email });
      setShowOtpInput(true);
      setCountdown(600); // Reset countdown to 10 minutes
      toast.success("OTP sent to your email");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error("Email and USN do not match our records");
      } else {
        toast.error("Failed to send OTP");
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showOtpInput) {
      // First send OTP
      await handleSendOtp();
    } else {
      // Verify OTP
      const isOtpValid = await handleVerifyOtp();
      if (isOtpValid) {
        // If OTP is valid, complete sign up
        try {
          const response = await axios.post("/api/users/signup", {
            ...userInput,
            imageUrl: "/default-avatar.png", // Default avatar
            about: "Student at the university",
            tag: userInput.usn, // Using USN as tag
          });

          if (response.data === "Created New Account") {
            toast.success("Account created successfully");
            router.push("/signin");
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            toast.error("Account with this email or USN already exists");
          } else {
            toast.error("Failed to create account");
          }
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100 dark:bg-darkTheme">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">Sign up as a student to get started</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={userInput.name}
            onChange={(e) => setUserInput((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Full Name"
            className="rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            value={userInput.email}
            onChange={(e) => setUserInput((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            value={userInput.usn}
            onChange={(e) => setUserInput((prev) => ({ ...prev, usn: e.target.value }))}
            placeholder="USN (University Seat Number)"
            className="rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            value={userInput.password}
            onChange={(e) => setUserInput((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            className="rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          {showOtpInput && (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="rounded-lg border-2 border-gray-300 p-3 text-center text-lg focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                <p>Code expires in {formatTime(countdown)}</p>
              </div>
            </>
          )}
          <button
            type="submit"
            className="rounded-lg bg-blue-500 p-3 text-white font-semibold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isVerifying || isSendingOtp}
          >
            {isVerifying || isSendingOtp ? (
              <span className="flex items-center justify-center">
                <LiaSpinnerSolid className="mr-2 animate-spin" />
                {isSendingOtp ? "Sending OTP..." : "Verifying..."}
              </span>
            ) : showOtpInput ? (
              "Verify OTP"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
        </div>
        <button
          className="flex items-center justify-center gap-2 w-full rounded-md bg-gray-100 p-3 font-bold shadow hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          type="button"
          onClick={() => toast("Google signup not implemented in this demo")}
        >
          <FcGoogle /> Sign Up with Google
        </button>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account,{' '}
          <Link href="/signin" className="text-blue-500 underline dark:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentSignupForm; 