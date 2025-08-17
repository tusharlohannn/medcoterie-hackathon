import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Posts from "../Components/Posts";
import { useEffect } from "react";

function UserHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || token.length === 0) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <>
      <Header isLoggedIn={true} />
      <Posts />
    </>
  );
}

export default UserHome;