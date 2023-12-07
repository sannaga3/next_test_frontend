import { Lato } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import authStore from "../../store/authStore";
import postStore from "../../store/postStore";

const lato = Lato({
  weight: ["900"],
  subsets: ["latin"],
});

const Header = () => {
  const router = useRouter();
  const { loginUser, setLoginUser } = authStore();
  const { setPosts } = postStore();

  const handleLogout = () => {
    const isLogout = window.confirm("Are you sure you want to log out?");
    if (isLogout) {
      setLoginUser(null);
      setPosts(null);
      localStorage.removeItem("token");
      localStorage.removeItem("post-store-storage");
      localStorage.removeItem("auth-store-storage");
      router.push({
        pathname: "/auth/login",
        query: {
          flashMessage: JSON.stringify({
            type: "success",
            messages: ["Logout successful."],
          }),
        },
      });
    }
  };

  return (
    <header className="flex justify-around bg-white p-4 mx-4 border-b-2 border-indigo-800">
      <div className="w-5/6 flex justify-start items-center space-x-6">
        <div className="w-44 flex justify-center items-center bg-indigo-800 text-slate-200 border-2 border-white rounded-3xl py-1 hover:bg-white hover:text-indigo-800 hover:border-indigo-800">
          <Link href="/posts" className="flex items-center font-semibold">
            <span className="pt-0.5">Post App</span>
          </Link>
        </div>
        <nav className={`${lato.className} ml-10`}>
          <ul className="flex items-center justify-center space-x-8 pt-1 ml-5">
            {loginUser ? (
              <>
                <li className="inline-block border-b px-2 pb-0.5 text-indigo-800 border-indigo-800 hover:border-indigo-600 hover:text-indigo-600">
                  <Link
                    href="/posts"
                    className="font-semibold hover:text-indigo-600"
                  >
                    PostList
                  </Link>
                </li>
                <li className="inline-block border-b px-2 pb-0.5 text-indigo-800 border-indigo-800 hover:border-indigo-600 hover:text-indigo-600">
                  <Link
                    href="/posts/store"
                    className="font-semibold hover:text-indigo-600"
                  >
                    NewPost
                  </Link>
                </li>
                <div className="inline-block border-b px-2 pb-0.5 text-indigo-800 border-indigo-800 hover:border-indigo-600 hover:text-indigo-600">
                  <div color="#6366f1" onClick={() => handleLogout()}>
                    Logout
                  </div>
                </div>
              </>
            ) : (
              <>
                <li className="inline-block border-b px-2 pb-0.5 text-indigo-800 border-indigo-800 hover:border-indigo-600 hover:text-indigo-600">
                  <Link
                    href="/auth/login"
                    className="font-semibold hover:text-indigo-600"
                  >
                    Login
                  </Link>
                </li>
                <li className="inline-block border-b px-2 pb-0.5 text-indigo-800 border-indigo-800 hover:border-indigo-600 hover:text-indigo-600">
                  <Link
                    href="/auth/register"
                    className="font-semibold hover:text-indigo-600"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {loginUser && (
          <div className="absolute right-7 top-6">
            name : {loginUser.username}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
