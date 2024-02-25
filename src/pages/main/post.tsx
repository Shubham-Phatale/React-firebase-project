import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Post as IPost } from "./main";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
  post: IPost;
}
interface Like {
  userId: string;
  id: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const likesRef = collection(db, "likes");
  const [likes, setLikes] = useState<Like[] | null>(null);

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, id: newDoc.id }]
            : [{ userId: user?.uid, id: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const dislikeQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );
      const dislikeData = await getDocs(dislikeQuery);
      const likeId = dislikeData.docs[0].id;
      const dislike = doc(db, "likes", likeId);
      await deleteDoc(dislike);
      if (user) {
        setLikes((prev) => prev && prev.filter((like) => like.id !== likeId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, id: doc.id }))
    );
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);
  return (
    <div className="postBox">
      <div className="title">
        <h1>{post.title}</h1>
      </div>
      <div className="body">
        <p>{post.description}</p>
      </div>
      {user && (
        <div className="footer">
          <p>Post by: {post.username}</p>
          <div className="likeBtn">
            <button
              className="buttonLike"
              onClick={hasUserLiked ? removeLike : addLike}
            >
              {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
            </button>
            {likes && <h4>{likes.length}</h4>}
          </div>
        </div>
      )}
    </div>
  );
};
