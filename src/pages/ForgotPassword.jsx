import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

const ForgotPassword = () => {
  const [user, setUser] = useState({ email: "", answer: "", newPassword:'' });
  let navigate = useNavigate();

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  let submitted = async (e) => {
    e.preventDefault();
    let regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,16}$/;
    if (!regExp.test(user.newPassword)) {
      return alert("Password is not valid");
    }

    try {
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/Forgotpassword`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        setUser({ email: "", answer: "", newPassword: "" });
        navigate("/login");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log("ForgotPassword", error);
    }
  };

  return (
    <Layout title={'Forgot password'}>
      <div className=" d-flex flex-column justify-content-center border" style={{ height:'90vh'}}>
        <div className=" col-md-3 mx-auto bg-dark text-white p-3">
          <div className="text-center shadow">
            <h4>Reset Password form</h4>
            <form onSubmit={submitted} action="">
              <input
                onChange={inputHandle}
                className=" form-control mt-2"
                type="email"
                name="email"
                value={user.email}
                placeholder="email"
                required
              />
              <input
                onChange={inputHandle}
                className=" form-control mt-2"
                type="text"
                name="answer"
                value={user.answer}
                placeholder="Type your answer during registration"
                required
              />
              <input
                onChange={inputHandle}
                className=" form-control mt-2"
                type="password"
                name="newPassword"
                value={user.newPassword}
                placeholder="Type your new password"
                required
              />
              <p>
                Passwod must be minimum eight and maximum 16 characters, at least
                one uppercase letter, one lowercase letter, one number and one
                special character (@$!%*#?&):
              </p>
              <button
                className=" btn btn-primary text-white fs-5 w-100 mt-2 btn-outline-success"
                type="submit"
              >
                Reset
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
