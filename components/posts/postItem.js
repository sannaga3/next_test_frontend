import dayjs from "dayjs";
import Link from "next/link";
import { contentStyle } from "../../styles/style";

const PostItem = ({ post, userId }) => {
  const createdAt = dayjs(post.created_at).format("YYYY-MM-DD hh:mm:ss");
  return (
    <div className="grid grid-cols-12 items-center space-x-2 border-b-2 border-slate-400 text-slate-700 text-sm px-4 pt-4 pb-2">
      <div className={contentStyle}>{post.id}</div>
      <div className={`${contentStyle} col-span-2`}>{post.user.username}</div>
      <div className={`${contentStyle} col-span-3`}>{post.title}</div>
      <div className={`${contentStyle} col-span-3`}>{post.content}</div>
      <div className={`${contentStyle} col-span-2`}>{createdAt}</div>
      <div className="text-center text-2xl">
        {userId === post.user.id && <Link href={`/posts/${post.id}`}>📄</Link>}
      </div>
    </div>
  );
};

export default PostItem;
