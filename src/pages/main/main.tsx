import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { Post } from "./post";
import { useAuthState } from "react-firebase-hooks/auth";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

const Main = () => {
  const [postList, setPostList] = useState<Post[] | null>(null);
  const postRef = collection(db, "posts");
  const [user] = useAuthState(auth);

  const getPost = async () => {
    const data = await getDocs(postRef);
    setPostList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    );
  };
  useEffect(() => {
    getPost();
  }, []);
  return (
    <div>
      {!user && <h2>Login to create your own post</h2>}
      {postList?.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default Main;
