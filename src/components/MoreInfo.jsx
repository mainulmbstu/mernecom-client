import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearch } from "../context/SearchContext";
import Layout from "./Layout";
import Loading from "./Loading";
import ReactImageMagnify from "react-image-magnify";

const MoreInfo = () => {
  const [moreInfo, setMoreInfo] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  let params = useParams();
  let { cart, setCart } = useSearch();
  const [loading, setLoading] = useState(false);

  let getMoreInfo = async () => {
    try {
      setLoading(true)
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/more-info/${params.pid}`,
        {
          method: "GET",
        }
      );
      setLoading(false);
      let data = await res.json();
      setMoreInfo(data.products[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // if (!moreInfo) return;
    getMoreInfo();
  }, [params]);
//=============================================
  let getSimilarProducts = async () => {
    try {
      setLoading(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/search/similar/${
          moreInfo?._id
        }/${moreInfo?.category?._id}`,
        {
          method: "GET",
        }
      );
      setLoading(false);
      let data = await res.json();
      setSimilarProducts(data.products);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (moreInfo.length < 1) return;
    getSimilarProducts();
  }, [moreInfo]);

  return (
    <Layout title={"More Information"}>
      <div className="px-2">
        <div className="row g-3">
          <div className="row g-4 border">
            <h1 className=" text-center">Details of product</h1>
            <hr />
            {loading && <Loading />}
            <div className=" col-md-6 pb-3 d-flex justify-content-center ">
              <div>
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "Product image",
                      // isFluidWidth: true,
                      src: `${moreInfo?.picture?.secure_url}`,
                      width: 300,
                      height: 400,
                    },
                    largeImage: {
                      src: `${moreInfo?.picture?.secure_url}`,
                      width: 1200,
                      height: 1800,
                    },
                    enlargedImageContainerDimensions: {
                      width: '300%',
                      height: '100%',
                    },
                  }}
                />
              </div>
            </div>
            <div className=" col-md-6 d-flex flex-column">
              <div>
                <h5>Name: {moreInfo?.name} </h5>
                <p>Product ID: {moreInfo?._id} </p>
                <p>Category: {moreInfo?.category?.name} </p>
                <p>Price: {moreInfo?.price} </p>
                <p>Quqntity: {moreInfo?.quantity} </p>
                <p>Description: {moreInfo?.description} </p>
              </div>
              <div className=" mt-auto mb-3 w-100">
                <button
                  onClick={() => {
                    setCart([...cart, moreInfo]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, moreInfo])
                    );
                    toast.success(`${moreInfo?.name} added to Cart`);
                  }}
                  className="btn btn-info mt-auto w-100"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className=" mb-4">
          <h4>Similar Products</h4>
          {/* {loading && <Loading/>} */}
          <div className="row g-3">
            {similarProducts?.length &&
              similarProducts?.map((item) => {
                return (
                  <div key={item?._id} className="col-md-3  ">
                    <div className="card h-100">
                      <img
                        src={`${item?.picture?.secure_url}`}
                        className=" card-img-top"
                        width={200}
                        height={200}
                        alt="image"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item?.name}</h5>
                        <div className="card-text">
                          <p>Category: {item?.category?.name} </p>
                          <p>Price: {item?.price} </p>
                          <p>Available quantity: {item?.quantity} </p>
                          <p>
                            Description: {item?.description.substring(0, 8)}{" "}
                            ....
                          </p>
                        </div>
                      </div>
                      <div className=" d-flex justify-content-evenly">
                        <Link to={`/products/more-info/${item._id}`}>
                          <button className="btn btn-primary ">
                            More info
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            setCart([...cart, item]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, item])
                            );
                            toast.success(`${item.name} added to Cart`);
                          }}
                          className="btn btn-info mt-auto mb-1"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MoreInfo;
