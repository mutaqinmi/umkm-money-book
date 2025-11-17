"use client";

import React, { useState } from "react";

const Eye = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOff = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.79 21.79 0 0 1 5-5"></path>
    <path d="M1 1l22 22"></path>
  </svg>
);

interface InputWithLabelProps {
  label: string;
  type?: string;
  id: string;
}

interface PasswordInputProps {
  label: string;
  id: string;
}

function InputWithLabel({ label, type = "text", id }: InputWithLabelProps) {
  return (
    <div className="flex flex-col w-full space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-900">
        {label}
      </label>

      <input
        id={id}
        type={type}
        className="
          w-full 
          bg-gray-100 
          border border-gray-200 
          rounded-xl 
          px-4 py-3 
          outline-none 
          focus:ring-2 
          focus:ring-black
        "
      />
    </div>
  );
}





function PasswordInput({ label, id }: PasswordInputProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-900">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="
            w-full 
            bg-gray-100 
            border border-gray-200 
            rounded-xl 
            px-4 py-3 
            outline-none 
            focus:ring-2 
            focus:ring-black
          "
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}




export default function LoginPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        <div>
          <h1 className="text-2xl font-bold">Masuk</h1>
          <p className="text-gray-600 text-sm">Masuk ke akun Anda.</p>
        </div>

        <InputWithLabel label="Email" type="email" id="email" />

        <PasswordInput label="Kata Sandi" id="password" />

        <button className="w-full bg-black text-white rounded-xl py-3 font-medium">
          Masuk
        </button>
      </div>
    </div>
  );
}
