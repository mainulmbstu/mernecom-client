import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../components/Layout";

const Login = () => {
  let { storeToken } = useAuth();
  const [user, setUser] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  let location = useLocation();
  const [showpass, setShowPass] = useState(false);

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  let submitted = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        storeToken(data.token);
        setUser({ email: "", password: "" });
        navigate(location.state || "/"); //state from Spinner.jsx
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log("login", error);
    }
  };

  return (
    <Layout title={"Login"}>
      <div className=" d-flex justify-content-center my-auto">
        <div className=" w-50 text-center shadow p-5">
          <h2>Login form</h2>
          <form onSubmit={submitted} action="">
            <input
              onChange={inputHandle}
              className=" form-control m-2"
              type="email"
              name="email"
              value={user.email}
              placeholder="email"
              required
            />
            <div className=" d-flex">
              <input
                onChange={inputHandle}
                className=" form-control m-2"
                type={showpass ? "text" : "password"}
                name="password"
                value={user.password}
                placeholder="password"
                required
              />
              <Link onClick={() => setShowPass((prev) => !prev)}>
                {showpass ? (
                  <FaEyeSlash className=" fs-2" />
                ) : (
                  <FaEye className=" fs-2" />
                )}
              </Link>
            </div>

            <button
              className=" btn btn-primary text-white fs-5 w-100 ms-2 btn-outline-success"
              type="submit"
            >
              Login
            </button>
          </form>
          <button
            onClick={() => navigate("/forgotpassword")}
            className=" btn btn-danger text-white fs-5 w-100 ms-2 mt-5 btn-outline-success"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
