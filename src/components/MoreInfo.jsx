import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSearch } from "../context/SearchContext";
import Layout from "./Layout";
import Loading from "./Loading";
// import ReactImageMagnify from "react-image-magnify";

const MoreInfo = () => {
  const [moreInfo, setMoreInfo] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  let params = useParams();
  let { cart, setCart } = useSearch();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState([]);
  //=================================
  let getMoreInfo = async () => {
    try {
      setLoading(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/more-info/${params.pid}`,
        {
          method: "GET",
        }
      );
      setLoading(false);
      let data = await res.json();
      setMoreInfo(data.products);
      setImg(data.products[0]?.picture[0]?.secure_url);
      // window.location.reload()
    } catch (error) {
      console.log(error);

    }
  };
  
  useEffect(() => {
    getMoreInfo();
  }, [params]);
  //=============================================
  let getSimilarProducts = async () => {
    try {
      setLoading(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/search/similar/${
          moreInfo[0]?._id
        }/${moreInfo[0]?.category?._id}`,
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


  let [test, settest]=useState([])

  let addrefs = useCallback(
    (el) => {
        settest((prev) => [...prev, el]);

    },[])
 
  let mouseOverHandle = (item, i) => {
    setImg(item.secure_url)
     test[i]?.classList.add("myImg");
    for (let k = 0; k < test.length; k++) {
       if (k !== i) {
         test[k]?.classList.remove("myImg");
       }
      
     }
  }



  return (
    <Layout title={"More Information"}>
      <div className="px-2">
        <div className="row g-3">
          <div className="row g-4 border">
            <h1 className=" text-center">Details of product</h1>
            <hr />
            {loading && <Loading />}
            <div className="col-md-7 row">
              <div className=" col-md-4 pb-3 order-sm-2 order-md-1 d-sm-flex d-lg-block flex-wrap">
                {moreInfo[0]?.picture?.map((item, i) => {
                  return (
                    <div className={`text-center  py-1`} key={i}>
                      <img
                        onMouseOver={() => {
                          mouseOverHandle(item, i);
                        }}
                        ref={addrefs}
                        style={{ cursor: "pointer" }}
                        src={`${item?.secure_url}`}
                        alt="img"
                        width={100}
                        height={100}
                        className={`px-3 ${i === 0 ? "myImg" : ""}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className=" col-md-8 pb-3 d-flex  justify-content-center order-sm-1 order-md-2">
                <img
                  src={img}
                  alt="image"
                  width={400}
                  height={500}
                  className="px-3"
                />
  
                {/* <div>
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
                </div> */}
              </div>
            </div>
            <div className=" col-md-5 px-md-5">
              <div>
                <h5>Name: {moreInfo[0]?.name} </h5>
                <p>Product ID: {moreInfo[0]?._id} </p>
                <p>Category: {moreInfo[0]?.category?.name} </p>
                <p>Price: {moreInfo[0]?.price} </p>
                <p>Quqntity: {moreInfo[0]?.quantity} </p>
                <p>Description: {moreInfo[0]?.description} </p>
              </div>
              <div className=" my-3 w-100">
                <button
                  onClick={() => {
                    setCart([...cart, moreInfo[0]]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, moreInfo[0]])
                    );
                    toast.success(`${moreInfo[0]?.name} added to Cart`);
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
                        src={`${item?.picture[0]?.secure_url}`}
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
