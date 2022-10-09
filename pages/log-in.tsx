import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { LoginResponse } from "@api/users/log-in";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import useMutation from "lib/client/useMutation";
import Layout from "components/layout";
import Input from "components/input";
import Button from "components/button";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<LoginFormData>();
  const [login, { data, loading, error }] = useMutation<
    LoginFormData,
    LoginResponse
  >("/api/users/log-in");

  const onValid = (formData: LoginFormData) => {
    if (!loading) {
      login(formData);
    }
  };

  useEffect(() => {
    if (data && data.ok) {
      console.log("User logged in ");
      // swr cacheを更新, NavBarの更新のため
      mutate("/api/users/me");

      // 元の場所に戻る
      router.replace("/");
    }
  }, [data, router]);

  console.log("error: ", error);

  return (
    <Layout>
      <div className="h-[40rem] md:h-[45rem] lg:h-[55rem] text-slate-900">
        <h1 className="p-5 text-2xl font-bold">Login</h1>
        <div className="flex flex-col justify-center items-center h-full">
          <form
            onSubmit={handleSubmit(onValid)}
            className="border-2 border-slate-300 border-opacity-20 bg-green-700 bg-opacity-20 p-10 rounded-md"
          >
            <div className="mb-6">
              <Input
                type="email"
                name="email"
                label="Email address"
                register={register("email", {
                  required: true,
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "I think I said _valid_, didn't I?",
                  },
                })}
                required
                placeholder="john.doe@company.com"
              />
            </div>
            <div className="mb-6">
              <Input
                type="password"
                name="password"
                label="password"
                register={register("password", {
                  required: true,
                  minLength: 8,
                })}
                required
              />
            </div>
            <div className="mt-10">
              {data && !data.ok && data.message && (
                <p className="text-red-500 text-center">{data.message}</p>
              )}
              <Button
                icon="in"
                type="submit"
                loading={loading}
                text={loading ? "Submitting ..." : "Login"}
              />
            </div>
          </form>
          <div className="p-20" />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
