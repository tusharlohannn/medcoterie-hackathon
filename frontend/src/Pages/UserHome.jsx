import Header from "../Components/Header";
import Posts from "../Components/Posts";


function UserHome() {
  return (
    <>
      <Header isLoggedIn={true} />
      <Posts />
    </>
  );
}

export default UserHome;