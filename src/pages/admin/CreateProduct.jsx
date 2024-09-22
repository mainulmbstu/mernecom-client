import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import Layout from "../../components/Layout";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../components/Loading";
import DeleteModal from "../../components/DeleteModal";


const CreateProduct = () => {
  let { token,} = useAuth();
  const [selectedItem, setSelectedItem] = useState([]);
  const [editProduct, setEditProduct] = useState('');
  //=============================================================
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let [products, setProducts] = useState([]);
  let [loading, setLoading] = useState(false);
  
  let getProducts = async () => {
    try {
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/product-list`,
        {
          params: {
            page: page,
            size: 10,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPage(page + 1);
      setTotal(data.total);
      setProducts([...products, ...data.products]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  //======================================================
  let [searchVal, setSearchVal] = useState("");

  let getSearchAdminProducts = async (e, page = 1) => {
    e && e.preventDefault();
    try {
      // if (!searchVal) return;
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/product-search`,
        {
          params: {
            keyword: searchVal,
            page: page,
            size: 8,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);

      setTotal(data.total);
      page === 1
        ? setProducts(data?.searchProduct)
        : setProducts([...products, ...data.searchProduct]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchVal]);

  //===================================================
  let [delItem, setDelItem] = useState('');

  let deleteItem = async (id) => {
    setLoading(true);
    // setSelectedItem(item);
    let res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/products/delete-product/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    let data = await res.json();
    if (res.ok) {
      toast.success(`${delItem?.name} is deleted successfully`);
      setLoading(false);
      window.location.reload()
    } else {
      toast.success(data?.msg);
    }
  };
  //====================================================================

  return (
    <Layout title={"Products"}>
      <div className="row ">
        <div className="col-md-3 p-2">
          <div className="card p-2">
            <AdminMenu />
          </div>
        </div>
        <div className=" col-md-9 p-2">
          <div className=" card p-2">
            <div className="">
              <div className=" d-flex justify-content-between mb-3">
                <h3>
                  Product List ({products?.length} of {total}){" "}
                </h3>

                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#createProduct"
                  >
                    Create Product
                  </button>
                  <CreateProductModal />
                </div>
              </div>

              <div className=" d-flex my-2">
                <div className="col-md-4">
                  <form
                    className="d-flex"
                    role="search"
                    onSubmit={getSearchAdminProducts}
                  >
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Product Name"
                      aria-label="Search"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-outline-black"
                      type="submit"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>

              <div className=" border">
                {loading && <Loading />}
                <InfiniteScroll
                  dataLength={products.length}
                  next={
                    !searchVal
                      ? getProducts
                      : (e) => {
                          setPage(page + 1);
                          getSearchAdminProducts(e, page + 1);
                        }
                  }
                  hasMore={products.length < total}
                  loader={<h1>Loading...</h1>}
                  endMessage={
                    <h4 className=" text-center">All items loaded</h4>
                  }
                >
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">SL</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products?.length &&
                        products.map((item, index) => {
                          return (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>
                                <img
                                  src={`${item?.picture?.secure_url}`}
                                  alt=""
                                  width="30"
                                />
                              </td>
                              <td>{item.name}</td>
                              <td>{item.category?.slug}</td>
                              <td>{item.price}</td>
                              <td>{item.quantity}</td>
                              {/* <td>{"edit/update"}</td> */}
                              <td>
                                <button
                                  onClick={() => setDelItem(item)}
                                  className="btn btn-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteCategory"
                                  disabled={loading}
                                >
                                  {loading && item._id === selectedItem._id ? (
                                    <>
                                      <div
                                        className="spinner-border text-primary"
                                        role="status"
                                        disabled
                                      >
                                        <span className="visually-hidden">
                                          Loading...
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>Delete</>
                                  )}
                                </button>

                                <button
                                  onClick={() => setEditProduct(item)}
                                  type="button"
                                  className="btn btn-primary ms-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editProduct"
                                >
                                  Details & Edit
                                </button>
                                <UpdateProductModal
                                  value={{
                                    editProduct,
                                    getProducts,
                                    setEditProduct,
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </InfiniteScroll>
                <DeleteModal value={{ func: deleteItem, item: delItem }} />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex">
          {products?.length < total ? (
            <>
              <button
                onClick={
                  !searchVal
                    ? getProducts
                    : (e) => {
                        setPage(page + 1);
                        getSearchAdminProducts(e, page + 1);
                      }
                }
                className="btn btn-primary my-3 px-3 mx-auto"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </Layout>
  );
};

export default  CreateProduct;
// export default UseEdit;
