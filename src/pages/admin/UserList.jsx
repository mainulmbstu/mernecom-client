import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "./AdminMenu";
import Layout from "../../components/Layout";

const UserList = () => {
  let [adminUsers, setAdminUsers] = useState([]);
  let [okdel, setOkdel] = useState(true);
  let { token, userInfo } = useAuth();

  let roleHandle = async (value, id) => {
    if (id === userInfo._id) {
      return alert("You cannot update yourself");
    }
    let res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/admin/user/status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: value }),
      }
    );
    let data = await res.json();
    setOkdel((prev) => !prev);
    await alert(data.msg);
  };

  useEffect(() => {
    if (token && userInfo.role) {
      fetch(`${import.meta.env.VITE_BASE_URL}/admin/user-list`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setAdminUsers(data))
        .catch((error) => console.log(error));
    }
  }, [token, okdel, userInfo.role]);

  let deletefn = async (id) => {
    if (id === userInfo._id) {
      return alert("You cannot delete yourself");
    }
    let res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    let data = await res.json();
    setOkdel((prev) => !prev);
    await alert(data.msg);
  };

  return (
    <Layout title={"User list"}>
      <div className="row ">
        <div className="col-md-3 p-2">
          <div className="card p-2">
            <AdminMenu />
          </div>
        </div>
        <div className=" col-md-9 p-2">
          <div className="card p-2">
            <h3>Total users ({adminUsers.length}) </h3>
            <div className=" border">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">SL</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">phone</th>
                    <th scope="col">Address</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.length > 0 &&
                    adminUsers.map((item, index) => {
                      return (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>
                            <select
                              onChange={(e) =>
                                roleHandle(e.target.value, item._id)
                              }
                              name=""
                              className=" border-0"
                            >
                              <option value={""}>
                                {item.role ? "Admin" : "User"}{" "}
                              </option>
                              <option value={0}>User</option>
                              <option value={1}>Admin</option>
                            </select>
                          </td>
                          <td>{item.phone}</td>
                          <td>{item.address}</td>
                          <td>
                            <button
                              onClick={() => deletefn(item._id)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserList;
