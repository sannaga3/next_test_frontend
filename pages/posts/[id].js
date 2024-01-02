import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import FlashMessage from "../../components/flashMessage";
import { defaultFlashMessage } from "../../constants";
import apiClient from "../../lib/apiClient";
import postStore from "../../store/postStore";
import { contentDetailStyle } from "../../styles/style";

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { post, setPost, posts, setPosts } = postStore();
  const [flashMessage, setFlashMessage] = useState(
    router.query?.flashMessage
      ? JSON.parse(router.query.flashMessage)
      : defaultFlashMessage
  );

  useEffect(() => {
    const fetchPost = async () => {
      const res = await apiClient.get(`/posts/${id}`);
      setPost(res.data);
    };
    fetchPost();
  }, []);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Do you really want to delete this?");

    if (isConfirmed) {
      const token = localStorage.getItem("token");
      if (token)
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
      else {
        return setFlashMessage({
          type: "error",
          messages: ["Session has expired. Please login again."],
        });
      }

      await apiClient.delete(`/posts/${post.id}`);
      setPost(null);

      const newPosts = posts.filter((data) => data.id !== post.id);
      setPosts(newPosts);

      router.push(
        {
          pathname: "/posts",
          query: {
            flashMessage: JSON.stringify({
              type: "success",
              messages: ["Delete successful."],
            }),
          },
        },
        "/posts"
      );
    }
  };

  return (
    <div className="flex flex-col justify-center py-5 sm:px-6 lg:px-8">
      <Head>
        <title>Show Post</title>
      </Head>
      {flashMessage.messages.length > 0 && (
        <FlashMessage flashMessage={flashMessage} />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Show Post
        </h2>
      </div>
      {post !== null && (
        <>
          <div className="w-1000px grid grid-cols-12 items-center mt-5">
            <div className={contentDetailStyle}>
              <div className="col-span-4">ID</div>
              <div className="col-span-8" data-testid="show-post-id">
                {post.id}
              </div>
            </div>
            <div className={contentDetailStyle}>
              <div className="col-span-4">username</div>
              <div className="col-span-8">{post.user.username}</div>
            </div>
            <div className={contentDetailStyle}>
              <div className="col-span-4">title</div>
              <div className="col-span-8">{post.title}</div>
            </div>
            <div className={contentDetailStyle}>
              <div className="col-span-4">content</div>
              <div className="col-span-8">{post.content}</div>
            </div>
            <div className={contentDetailStyle}>
              <div className="col-span-4">created_at</div>
              <div className="col-span-8">{post.created_at}</div>
            </div>
          </div>

          <div className="flex justify-center space-x-5 mt-5">
            <div className="mt-8 col-start-3 col-span-8">
              <div className="w-20 h-8 flex justify-center items-center bg-orange-500 rounded-lg text-white">
                <Link
                  href={{
                    pathname: `/posts/${post.id}/edit`,
                    query: { post: post },
                  }}
                  as={`/posts/${post.id}/edit`}
                  className="block pt-0.5"
                >
                  Edit
                </Link>
              </div>
            </div>
            <div className="mt-8 col-span-8">
              <div className="w-20 h-8 flex justify-center items-center bg-indigo-500 rounded-lg text-white">
                <Link href={"/posts"} className="block pt-0.5">
                  ⬅︎ Back
                </Link>
              </div>
            </div>
            <div className="mt-8 col-span-8">
              <Button
                type="button"
                onClick={handleDelete}
                useDefaultClass={false}
                classProps="w-20 h-8 flex justify-center items-center bg-red-500 rounded-lg text-white"
                text="Delete"
                width={60}
                height={30}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail;
