import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useMutation from "lib/client/useMutation";
import Layout from "../components/layout";
import Input from "../components/input";
import Button from "../components/button";
import { SigninResponse } from "@api/users/sign-in";

interface SigninFormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

const Signin: NextPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors: formErrors },
  } = useForm<SigninFormData>();
  const [signin, { data, loading }] = useMutation<
    SigninFormData,
    SigninResponse
  >("/api/users/sign-in");

  const onValid = (formData: SigninFormData) => {
    if (!formData.agreement) {
      setError("agreement", {
        message: "Please agree to the terms and conditions",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("password", {
        message: "Passwords do not match.",
      });
      return;
    }
    if (!loading) {
      signin(formData);
    }
  };

  useEffect(() => {
    if (data && data.ok) {
      console.log("User created successfully");
      router.replace("/log-in");
    }
  }, [data, router]);

  return (
    <Layout>
      <div className="h-[40rem] md:h-[45rem] lg:h-[55rem] text-theme-black">
        <h1 className="p-5 text-2xl font-bold">Sign In</h1>
        <div className="flex flex-col justify-center items-center h-full">
          <form
            onSubmit={handleSubmit(onValid)}
            className="border-2 border-slate-300 border-opacity-20 bg-green-700 bg-opacity-20 p-10 rounded-md"
          >
            <div className="mb-6">
              <Input
                type="email"
                name="email"
                label="Email"
                register={register("email", {
                  required: true,
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "I think I said _valid_, didn't I?",
                  },
                })}
                placeholder="john.doe@company.com"
              />
            </div>
            <div className="mb-6">
              <Input
                type="password"
                name="password"
                label="Password"
                register={register("password", {
                  required: true,
                  minLength: 8,
                })}
              />
            </div>
            <div className="mb-6">
              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                register={register("confirmPassword", {
                  required: true,
                  minLength: 8,
                })}
              />
            </div>
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="agreement"
                  type="checkbox"
                  {...register("agreement", { required: true })}
                  className="w-4 h-4 accent-theme-green"
                  required
                />
              </div>
              <label
                htmlFor="agreement"
                className="after:content-['*'] after:ml-0.5 after:text-red-500 ml-2 text-sm font-medium"
              >
                I agree with the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-500"
                >
                  terms and conditions
                </a>
                .
              </label>
            </div>
            <div className="mt-5">
              {formErrors?.password && (
                <div className="text-red-500">
                  {formErrors.password?.message}
                </div>
              )}
              {formErrors?.agreement && (
                <div className="text-red-500">
                  {formErrors.agreement?.message}
                </div>
              )}
              <Button
                icon="in"
                text={loading ? "Signing in ..." : "Sign In"}
              />
            </div>
          </form>
          <div className="p-10" />
        </div>
      </div>
    </Layout>
  );
};

export default Signin;
