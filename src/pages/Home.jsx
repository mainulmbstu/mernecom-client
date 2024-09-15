import { useEffect, useState } from "react";
import useStore from "../hooks/useStore";
import {  Checkbox } from "antd";
import { toast } from "react-toastify";
import { Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import Layout from "../components/Layout";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Home = () => {
  let { category, } = useStore();
  let { products, setProducts, page, setPage } = useAuth();
  let {cart, setCart } = useSearch();

  // let cat = () => {};

  const [checkedCat, setCheckedCat] = useState([]);
  const [priceCat, setPriceCat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  let catHandle = (checked, id) => {
    let all = [...checkedCat];
    if (checked) {
      all.push(id);
    } else {
      all = all.filter((item) => item !== id);
    }
    setCheckedCat(all);
  };
  // let checkedArr = products.filter((item) =>
  //   checkedCat?.includes(item.category._id)
  // );
  // let newArr = checkedCat.length === 0 ? products : checkedArr;
  //==============  filter ====================================
  let getProductFilter = async () => {
    let res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/product-filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkedCat, priceCat }),
    });
    let data = await res.json();
    if (!res.ok) {
      return toast.error(data.msg);
    }
    setProducts(data?.products);
  };

  useEffect(() => {
    getProductFilter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedCat, priceCat]);

  // useEffect(() => {
  //  if(checkedCat.length || priceCat.length) getProductFilter();

  // }, [checkedCat, priceCat]);
  //========== all products ==================

  // let getProducts = async () => {
  //   let res = await fetch(
  //     `http://localhost:8000/products/product-list-per-page/${page}`,
  //     {
  //       method: "GET",
  //     }
  //   );
  //   let data = await res.json();
  //   setProducts(data.products);
  // };

  // useEffect(() => {
  //   getProducts();
  // }, []);

  let loadMore = async () => {
    setLoading(true);
    let res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/products/product-list-per-page/${page}`,
      {
        method: "GET",
      }
    );
    let data = await res.json();
    setProducts((prev) => [...prev, ...data.products]);
    setLoading(false);
  };
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  //=================== get total no. of products
  let getTotal = async () => {
    let res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/product-count`, {
      method: "GET",
    });
    let data = await res.json();
    setTotal(data?.total);
  };

  useEffect(() => {
    getTotal();
  }, []);

  return (
    <Layout title={'home'}>
    <div className="row px-3">
      <div className="col-md-2">
        <h5>Category</h5>
        <div className=" d-flex flex-column">
          {category.map((item) => (
            <Checkbox
              key={item._id}
              onChange={(e) => catHandle(e.target.checked, item._id)}
            >
              {item.name}
            </Checkbox>
          ))}

          {/* {category?.map((item) => {
            return (
              <div key={item._id} className="input-group mb-3">
                <div className="input-group-text">
                  <input
                    onChange={(e) => catHandle(e.target.checked, item._id)}
                    name="category"
                    // checked
                    value={item._id}
                    className="form-check-input mt-0"
                    type="checkbox"
                    aria-label="Checkbox for following text input"
                  />
                </div>

                <input
                  onChange={cat}
                  value={item.name}
                  type="text"
                  className="form-control"
                  aria-label="Text input with checkbox"
                />
              </div>
            );
          })} */}
        </div>

        <div>
          <h5>Price Category</h5>
          {/* <Radio.Group onChange={(e) => setPriceCat(e.target.value)}>
            {priceCategory.map((p) => {
              return (
                <div key={p._id}>
                  <Radio name="price" value={p.array}>
                    {p.name}
                  </Radio>
                </div>
              );
            })}
          </Radio.Group> */}
          <div className=" d-flex flex-column">
            <div>
              <input
                onChange={() => setPriceCat([1, 20])}
                type="radio"
                name="kkk"
                id="one"
              />
              <label htmlFor="one">1-20</label>
            </div>
            <div>
              <input
                onChange={() => setPriceCat([21, 40])}
                type="radio"
                name="kkk"
                id="two"
              />
              <label htmlFor="two">21-40</label>
            </div>
            <div>
              <input
                onChange={() => setPriceCat([41, 60])}
                type="radio"
                name="kkk"
                id="three"
              />
              <label htmlFor="three">41-60</label>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={() => window.location.reload()}
            className=" btn btn-success"
          >
            Reset Filter
          </button>
        </div>
      </div>

      <div className="col-md-10">
        
        <h3>{!checkedCat.length ? "All Products" : "Products by category"}</h3>
        <h3 className=" text-danger">
          {!products?.length ? "No Product Found!!" : ""}
        </h3>
        <div className="row g-3">
          {products?.map((item) => {
            return (
              <div key={item._id} className="col-md-3  ">
                <div className="card h-100">
                  <LazyLoadImage
                    src={`${item?.picture?.secure_url}`}
                    className=" "  height={150}
                    alt="image"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <div className="card-text">
                      <p className="m-0">Category: {item?.category?.name} </p>
                      <p className="m-0">Price: {item.price} </p>
                      <p className="m-0">Available quantity: {item.quantity} </p>
                      <p className="m-0">
                        Description: {item.description.substring(0, 8)} ....{" "}
                      </p>
                    </div>
                  </div>
                  <div className=" d-flex justify-content-evenly">
                      <Link to={`products/more-info/${item?._id}`}>
                        <button
                          // onClick={() => navigate(`products/more-info/${item?._id}`)}
                          className="btn btn-primary "
                        >
                          More info
                        </button>
                      </Link>
                    <button
                      onClick={() => {
                        setCart([...cart, item])
                        localStorage.setItem('cart', JSON.stringify([...cart, item]))
                        toast.success(`${item.name} added to Cart`);
                      }}
                      className="btn btn-info mt-auto mb-1">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="m-3 d-flex justify-content-center">
        {products && products.length < total && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}
            className="btn btn-success px-5"
          >
            {loading ? "loading..." : "Load More"}
          </button>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default Home;
