import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Layout from "../../components/Layout";

const ProductUpdateInput = () => {
  let [loading, setLoading] = useState(false);
  let [trix, setTrix] = useState(true);
  const [inputVal, setInputVal] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    picture: "",
    shipping: "",
  });

  let { token, getProducts, category, editData, setEditData } = useAuth();

  if (editData?.name && trix) {
    setInputVal({
      name: editData.name,
      description: editData.description,
      category: editData.category._id,
      price: editData.price,
      quantity: editData.quantity,
      picture: "",
      shipping: editData.shipping,
    });
    setTrix(false);
  }

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setInputVal((prev) => ({ ...prev, [name]: value }));
  };

  let productSubmit = async (e) => {
    e.preventDefault();

    let formdata = new FormData();
    inputVal?.picture &&
      formdata.append("picture", inputVal?.picture, inputVal?.picture?.name);
    formdata.append("name", inputVal.name);
    formdata.append("description", inputVal.description);
    formdata.append("category", inputVal.category);
    formdata.append("price", inputVal.price);
    formdata.append("quantity", inputVal.quantity);
    formdata.append("shipping", inputVal.shipping);
    try {
      await setLoading(true);

      let { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/update-product/${
          editData._id
        }`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.msg);
        setInputVal({
          name: "",
          description: "",
          category: "",
          price: "",
          quantity: "",
          picture: "",
          shipping: "",
        });
        setTrix(true);
        setEditData([]);
        await getProducts();
        setLoading(false);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log({ msg: "update product", error });
    }
  };

  return (
    <Layout title={"Product list"}>
      <div className="row  ">
        {/* <div className="col-md-3 p-2">
        <div className="card p-2">
          <AdminMenu />
        </div>
      </div> */}
        <div className=" p-2">
          <div className="card p-2">
            <div className=" border">
              <form
                onSubmit={productSubmit}
                className="px-4"
                encType="multipart/form-data"
              >
                <input
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="text"
                  name="name"
                  value={inputVal.name}
                  placeholder="Enter product name"
                />

                <div className="mb-2">
                  <input
                    className="form-control"
                    list="categoryList"
                    type={"text"}
                    placeholder={editData?.category?.name}
                    onChange={(e) => {
                      let cat = category.filter(
                        (item) => item.slug === e.target.value
                      );
                      setInputVal((prev) => ({
                        ...prev,
                        category: cat[0]?._id,
                      }));
                    }}
                  />

                  <datalist id="categoryList">
                    {category.map((item) => {
                      return <option key={item._id} value={item.slug}></option>;
                    })}
                  </datalist>
                </div>

                <input
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="number"
                  name="price"
                  value={inputVal.price}
                  placeholder="Enter price"
                />

                <input
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="number"
                  name="quantity"
                  value={inputVal.quantity}
                  placeholder="Enter quantity"
                />

                <div className="input-group mb-3">
                  <label className="input-group-text" htmlFor="shipping">
                    Shipping
                  </label>
                  <select
                    name="shipping"
                    onChange={(e) => {
                      return setInputVal((prev) => ({
                        ...prev,
                        shipping: e.target.value,
                      }));
                    }}
                    className="form-select"
                    id="shipping"
                  >
                    <option>{inputVal.shipping ? "Yes" : "No"} </option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pic" className="btn">
                    Upload product image
                  </label>
                  <input
                    className=" form-control mb-2"
                    id="pic"
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={(e) => {
                      inputHandle({
                        target: { name: "picture", value: e.target.files[0] },
                      });
                    }}
                  />
                </div>
                <div className="mb-4 ms-2 d-flex justify-content-evenly">
                  {inputVal.picture && (
                    <div>
                      <p>New uploaded</p>
                      <img
                        src={URL.createObjectURL(inputVal.picture)}
                        alt="image"
                        className="img img-responsive"
                        height={"100px"}
                      />
                    </div>
                  )}

                  <div>
                    <p>Current Image</p>
                    <img
                      src={editData?.picture?.secure_url}
                      alt="image"
                      className="img img-responsive"
                      height={"100px"}
                    />
                  </div>
                </div>

                <textarea
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="text"
                  rows="4"
                  name="description"
                  value={inputVal.description}
                  placeholder="Enter product description"
                />
                <div className=" d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn  btn-danger text-white fs-5 w-25 ms-2 btn-outline-dark"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>

                  {loading ? (
                    <>
                      <button
                        className="btn btn-primary w-50 fs-5 ms-2"
                        type="button"
                        disabled
                      >
                        <span
                          className="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Uploadin data...
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className=" btn  btn-primary text-white fs-5 w-50 ms-2 btn-outline-dark"
                        type="submit"
                      >
                        Update Product
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductUpdateInput;
