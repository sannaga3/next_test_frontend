import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FlashMessage from "../../components/flashMessage";
import { defaultFlashMessage } from "../../constants";
import apiClient from "../../lib/apiClient";
import authStore from "../../store/authStore";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [flashMessage, setFlashMessage] = useState(
    router.query?.flashMessage
      ? JSON.parse(router.query.flashMessage)
      : defaultFlashMessage
  );
  const { loginUser, setLoginUser } = authStore();

  useEffect(() => {
    if (loginUser !== null) router.push("/posts");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      if (!token) throw new Error();
      localStorage.setItem("token", token);
      await setLoginUser(res.data.user);

      router.push(
        {
          pathname: "/posts",
          query: {
            flashMessage: JSON.stringify({
              type: "success",
              messages: ["Login successful."],
            }),
          },
        },
        "/posts"
      );
    } catch (e) {
      setFlashMessage({
        type: "error",
        messages: [e.response.data.error],
      });
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Login</title>
      </Head>
      {flashMessage.messages.length > 0 && (
        <FlashMessage flashMessage={flashMessage} />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleLogin} data-testid="login-form">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
