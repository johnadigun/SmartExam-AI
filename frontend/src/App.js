import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {

  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div>
        <Register />
        <Login />
      </div>
    );
  }

  return <Dashboard />;
}