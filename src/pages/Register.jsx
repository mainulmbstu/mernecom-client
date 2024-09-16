import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
    const [showpass, setShowPass] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });

  let navigate = useNavigate();

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  let submitted = async (e) => {
    e.preventDefault();
    let regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,16}$/;
    if (!regExp.test(user.password)) {
      // return setMsg("Password not valid");
      return alert("Password is not valid");
    }

    try {
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        setUser({ name: "", email: "", password: "", phone: "", address: "" });
        navigate("/login");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let hints = `Passwod must be minimum 8 and maximum 16 characters, at least one uppercase
          letter, one lowercase letter, one number and one special character
          (@$!%*#?&)`;

  return (
    <Layout title={"register"}>
      <div className=" d-flex justify-content-around my-auto ">
        <div className="text-center shadow pe-3 pb-2">
          <h2 className=" text-uppercase ps-3">Registration form</h2>
          <form onSubmit={submitted} action="">
            <input
              onChange={inputHandle}
              className=" form-control m-2"
              type="text"
              name="name"
              value={user.name}
              placeholder="Full Name"
              required
            />
            <input
              onChange={inputHandle}
              className=" form-control m-2"
              type="email"
              name="email"
              value={user.email}
              placeholder="email"
              required
            />
            <div className=" ms-2 text-start"><label className="" title={hints}> Password hints:</label></div>
            <div className=" position-relative">
              <input
                onChange={inputHandle}
                className=" form-control m-2 "
                type={showpass ? "text" : "password"}
                name="password"
                value={user.password}
                placeholder="password"
                required
              />
              <div className=" position-absolute">
                <Link onClick={() => setShowPass((prev) => !prev)}>
                  {showpass ? (
                    <FaEyeSlash className=" fs-2" />
                  ) : (
                    <FaEye className=" fs-2" />
                  )}
                </Link>
              </div>
            </div>
            <input
              onChange={inputHandle}
              className=" form-control m-2"
              type="text"
              name="phone"
              value={user.phone}
              placeholder="Phone number"
              required
            />
            <input
              onChange={inputHandle}
              className=" form-control m-2"
              type="text"
              name="address"
              value={user.address}
              placeholder="address"
              required
            />
            <input
              onChange={inputHandle}
              className=" form-control m-2"
              type="text"
              name="answer"
              value={user.answer}
              placeholder="What is your favorite game"
              required
            />
            {/* <p className=' text-danger'>{msg} </p> */}
            <button
              className=" btn btn-primary text-white fs-5 w-100 ms-2 btn-outline-success"
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
