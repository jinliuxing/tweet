import useUser from "lib/client/useUser";
import { ReactNode } from "react";
import { mutate } from "swr";

interface LayoutProps {
  readonly children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useUser(false);
  const logout = () => {
    fetch("/api/users/log-out").then(() => mutate("/api/users/me"));
  };

  return (
    <div className="relative">
      <div className="min-w-full w-screen min-h-min flex justify-center">
        <div className="w-full bg-opacity-90">
          <div className="flex justify-end">
            <div className="m-2 relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              {user && (
                <div
                  onClick={logout}
                  className="absolute hidden group-hover:flex z-10 right-0 bg-white px-3 cursor-pointer  hover:bg-theme bg-opacity-25"
                >
                  Logout
                </div>
              )}
              {!user && (
                <div className="hidden group-hover:flex absolute flex-col z-10 right-0">
                  <a
                    href="/log-in"
                    className="bg-white px-3 cursor-pointer border-b-2 hover:bg-theme hover:bg-opacity-25"
                  >
                    Login
                  </a>
                  <a
                    href="/create-account"
                    className="bg-white px-3 cursor-pointer border-b-2 hover:bg-theme hover:bg-opacity-25"
                  >
                    Signin
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center items-start ">
            <div className="max-w-screen-md w-[80%] py-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
