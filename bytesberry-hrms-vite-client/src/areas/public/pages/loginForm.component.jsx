/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import axios from "../../../api/axios";

import bbLogo from "../../../assets/bbLogo.png";

import Input from "../../../reusable-components/inputs/InputTextBox/Input";
import PasswordInput from "../../../reusable-components/inputs/InputTextBox/PasswordInput";
import Spinner from "../../../reusable-components/spinner/spinner.component";

const LoginForm = () => {
  const navigate = useNavigate();

  const [isLoggingInText, setIsLoggingInText] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
    setValue,
    control,
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
  });

  const onSubmitLogin = async (data) => {
    try {
      setIsLoggingInText(true);
      // Simulate a delay of 5 to 8 seconds using a timeout
      await new Promise((resolve) =>
        // setTimeout(resolve, Math.floor(Math.random() * 3000) + 5000)
        setTimeout(resolve, 5000)
      );

      navigate("/system-admin/dashboard");
    } catch (error) {
      console.error("An error occurred during login:", error);
    } finally {
      setIsLoggingInText(false);
    }
  };

  return (
    <section className="w-[80%] lg:w-[60%] mx-auto min-h-screen mt-24">
      <div className="flex justify-center w-40 md:w-56 lg:w-full mx-auto mb-5">
        <img src={bbLogo} className="h-12" />
      </div>

      <div className="p-1 md:p-5">
        <div className="flex flex-col justify-center">
          <div className="text-center text-primary text-base md:text-lg lg:text-xl font-semibold mb-3">
            Admin Login
          </div>
        </div>

        {/* Form section */}
        <section className="mt-4 mx-auto max-w-[80%] md:max-w-[65%]">
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <div>
              <Input
                defaultName="user_email"
                register={register}
                name="Username"
                required={true}
                pattern={null}
                errors={errors}
                placeholder="Enter username"
                setError={setError}
                clearError={clearErrors}
                autoComplete="off"
                type="text"
                classes={`rounded-md px-3 py-2 text-sm w-full`}
                onChangeInput={null}
                // defaultValue={defaultValues.user_email}
                setValue={setValue}
              />
            </div>

            <div className="mt-5">
              <PasswordInput
                id="myPasswordInput"
                type="password"
                defaultName="user_password"
                register={register}
                name="Password"
                required={true}
                pattern={null}
                errors={errors}
                placeholder="Enter password"
                setError={setError}
                clearError={clearErrors}
                autoComplete="off"
                classes={`rounded-md px-3 py-2 text-sm w-full`}
                onChangeInput={null}
                // defaultValue={defaultValues.user_password}
                setValue={setValue}
              />
            </div>

            <div className="mt-10 flex flex-col flex-grow">
              <button
                onClick={() => handleSubmit()}
                className="bg-primary text-white text-sm px-3 py-1 lg:px-5 lg:py-3 uppercase"
              >
                {!isLoggingInText ? (
                  <div className="flex gap-x-1 justify-center items-center">
                    Login
                  </div>
                ) : (
                  <div className="flex gap-x-1 justify-center items-center">
                    <p>Logging in</p>
                    <p className="pl-1">
                      <Spinner />
                    </p>
                  </div>
                )}
              </button>
            </div>
          </form>
        </section>
        {/* form section */}
      </div>
    </section>
  );
};

export default LoginForm;
