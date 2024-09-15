import React, { useEffect } from "react";
import UserMenu from "./UserMenu";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";




const Orders = () => {
  let [loading, setLoading] = useState(false);
  let [orders, setOrders] = useState([]);
  let { token } = useAuth();
// console.log(orders);
  let getUserOrders = async () => {
    try {
      await setLoading(true);

      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/orders`,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.msg);
        setOrders(data.orders);
        setLoading(false);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log({ msg: "getUserOrders", error });
    }
  };

  useEffect(() => {
    if (token) getUserOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="row ">
      <div className="col-sm-3 p-2">
        <div className="card p-2">
          <UserMenu />
        </div>
      </div>
      <div className=" col-sm-9 p-2">
        <div className=" card p-2 text-center"><h2>All orders ({orders?.length})</h2></div>

        <div className="row ">
          {orders?.map((item, i) => {
            return (
              <div key={item._id} className=" mt-5 shadow">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Qnty</th>
                      <th scope="col">Total Price</th>
                      <th scope="col">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1} </td>
                      <td>{item?.status} </td>
                      <td>{item?.payment?.status ? "Success" : "Failed"} </td>
                      <td>{item?.products.length} </td>
                      <td>{item?.total} </td>
                      <td>{moment(item?.createdAt).fromNow()} </td>
                    </tr>
                  </tbody>
                </table>
                {
                  item?.products?.map((p, i) => {
                    return (
                      <div key={i} className="row g-5">
                        <div className="row g-4">
                         
                          <div className=" col-sm-6">
                            <img
                              src={`${p?.picture?.secure_url}`}
                              className=" ms-3"
                              width={100}
                              height={100}
                              alt="image"
                            />
                          </div>
                          <div className=" col-sm-6 d-flex flex-column">
                            <div>
                              <h5>Name: {p?.name} </h5>
                              <p>Category: {p?.category?.name} </p>
                              <p>Price: {p?.price} </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
