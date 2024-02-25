import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import "../App.css";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const signUserOutut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">Home</Link>
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <Link to="/createpost">Create Post</Link>
        )}
      </div>
      <div className="user">
        {user && (
          <>
            <p>{user?.displayName}</p>
            <img src={user?.photoURL || ""} width="40" height="40" />
            <button className="logout" onClick={signUserOutut}>
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
