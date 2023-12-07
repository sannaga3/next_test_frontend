import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import FlashMessage from "../../../components/flashMessage";
import { defaultFlashMessage } from "../../../constants";
import apiClient from "../../../lib/apiClient";
import authStore from "../../../store/authStore";
import postStore from "../../../store/postStore";

const UpdatePost = () => {
  const router = useRouter();
  const { loginUser } = authStore();
  const { post, posts, setPosts } = postStore();
  const { targetPost } = router.query;
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [flashMessage, setFlashMessage] = useState(
    router.query?.flashMessage
      ? JSON.parse(router.query.flashMessage)
      : defaultFlashMessage
  );

  const target = targetPost ?? post;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token)
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
      else {
        return setFlashMessage({
          type: "error",
          message: "Session has expired. Please log in again.",
        });
      }

      const res = await apiClient.patch(`/posts/${target.id}`, {
        title: title,
        content: content,
      });
      let post = res.data;
      post.user = {
        id: loginUser.id,
        username: loginUser.username,
      };

      const newPosts = posts.map((data) => {
        if (data.id === post.id) return post;
        return data;
      });
      setPosts(newPosts);

      router.push({
        pathname: `/posts/${target.id}`,
        query: {
          flashMessage: JSON.stringify({
            type: "success",
            messages: ["update successful."],
          }),
        },
      });
    } catch (e) {
      setFlashMessage({
        type: "error",
        messages: ["Title and content are required."],
      });
    }
  };

  return (
    <div className="flex flex-col justify-center py-5 sm:px-6 lg:px-8">
      <Head>
        <title>Edit Post</title>
      </Head>
      {flashMessage.messages.length > 0 && (
        <FlashMessage flashMessage={flashMessage} />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Post
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                content
              </label>
              <input
                id="content"
                name="content"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                submit
              </button>
            </div>
          </form>
          <div className="mt-8 col-start-3 col-span-8">
            <div className="w-20 h-8 flex justify-center items-center bg-indigo-500 rounded-lg text-white">
              <Link href={`/posts/${target.id}`} className="block pt-0.5">
                ⬅︎ back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
