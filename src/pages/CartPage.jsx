import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";

export const CartPage = () => {
  let { token, userInfo } = useAuth();
  let { cart, setCart } = useSearch();
  let navigate = useNavigate();

  let totalPrice = () => {
    try {
      let total = 0;
      cart.map((item) => (total += item.price));
      return total;
    } catch (error) {
      console.log(error);
    }
  };

  let removeCartItem = (id) => {
    try {
      let index = cart?.findIndex((item) => item._id === id);
      let newCart = cart?.toSpliced(index, 1);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };

  let checkout = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/order/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart }),
        }
      );
      let data = await res.json();
      console.log(data);
      window.location.replace(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"cart"}>
      <div>
        <div className="row text-center mb-5">
          <h3>{token ? `Hello ${userInfo?.name}` : "Hello Guest"}</h3>
          <h4 className="">
            {cart?.length
              ? `You have ${cart?.length} items in cart ${
                  token ? "" : "Please login to checkout"
                }`
              : "Your cart is empty"}
          </h4>
        </div>
        <hr />
        <div className="row mt-5">
          <div className="col-md-8 mt-0">
            {cart.map((item, i) => {
              return (
                <div key={i} className="row border p-1 mb-2">
                  <div className=" col-md-4 ">
                    <img
                      src={`${item?.picture?.secure_url}`}
                      className=" w-100"
                      height={200}
                      alt="image"
                    />
                  </div>
                  <div className=" col-md-8">
                    <div className=" d-flex flex-column h-100">
                      <div>
                        <h5>Name: {item?.name} </h5>
                        <p className="m-0">Product ID: {item?._id} </p>
                        <p className="m-0">Category: {item?.category?.name} </p>
                        <p className="m-0">Price: {item?.price} </p>
                        <p className="m-0">
                          Description: {item?.description.substring(0, 13)}{" "}
                        </p>
                      </div>
                      <div className=" mt-auto">
                        <button
                          onClick={() => removeCartItem(item._id)}
                          className="btn btn-danger mb-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <p>Total|| Checkout|| Payment</p>
            <hr />
            <h3>Total: BDT {totalPrice()}</h3>
            <hr />
            {userInfo?.address ? (
              <>
                <h4>Current Address</h4>
                <h5>{userInfo?.address} </h5>
                <button
                  onClick={() => navigate("/dashboard/user/profile")}
                  className="btn btn-success"
                >
                  Update address
                </button>
              </>
            ) : (
              <div>
                <button
                  onClick={() => navigate("/login", { state: "/cart" })}
                  className="btn btn-primary"
                >
                  Please login to checkout
                </button>
              </div>
            )}
            {cart?.length ? (
              <div className="my-4 w-100">
                <button onClick={checkout} className="btn btn-danger w-100">
                  Check out
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default CartPage;
