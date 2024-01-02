import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import FlashMessage from "../../components/flashMessage";
import PostItem from "../../components/posts/postItem";
import { defaultFlashMessage, emptyArray } from "../../constants";
import apiClient from "../../lib/apiClient";
import authStore from "../../store/authStore";
import postStore from "../../store/postStore";
import { contentStyle } from "../../styles/style";

const PostList = () => {
  const router = useRouter();
  const { loginUser } = authStore();
  const { posts, setPosts } = postStore();
  const memoizedPosts = useMemo(() => posts ?? emptyArray, [posts]);
  const flashMessage = router.query?.flashMessage
    ? JSON.parse(router.query.flashMessage)
    : defaultFlashMessage;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (memoizedPosts.length === 0) {
          const res = await apiClient.get("/posts");
          setPosts(res.data || emptyArray);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>PostList</title>
      </Head>
      {flashMessage.messages.length > 0 && (
        <FlashMessage flashMessage={flashMessage} />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="my-6 text-center text-3xl font-extrabold text-gray-900">
          PostList
        </h2>
      </div>
      {loginUser && memoizedPosts.length > 0 && (
        <div className="flex flex-col items-center">
          <div>
            <div className="grid grid-cols-12 items-center space-x-2 border-b-2 border-slate-400 text-slate-700 text-sm px-4 pt-4 pb-2">
              <div className={contentStyle}>ID</div>
              <div className={`${contentStyle} col-span-2 font-bold`}>
                username
              </div>
              <div className={`${contentStyle} col-span-3 font-bold`}>
                title
              </div>
              <div className={`${contentStyle} col-span-3 font-bold`}>
                content
              </div>
              <div className={`${contentStyle} col-span-2 font-bold`}>
                created_at
              </div>
              <div className="text-center font-bold">detail</div>
            </div>
            <div className="container mb-10">
              {memoizedPosts.map((post) => (
                <div key={post.id} data-testid="post-item">
                  <PostItem post={post} userId={loginUser.id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
