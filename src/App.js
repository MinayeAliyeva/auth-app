import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Login from "./components/Login";
import Logout from "./components/LogOut";
import SignUp from "./components/SignUp";

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) =>
    console.log("useSelector state", state)
  );

  return (
    <div className="App">
      <SignUp />
      <Login />
      <Logout />
    </div>
  );
}

export default App;
