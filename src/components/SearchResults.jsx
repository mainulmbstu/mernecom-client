import { Link } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { toast } from "react-toastify";
import Layout from "./Layout";

const SearchResults = () => {
  let { cart, setCart } = useSearch();
  const { values } = useSearch();
  return (
    <Layout title={"Search result"}>
      <div className="row g-3">
        <h3>Search results ({values?.results?.length}) </h3>
        {values?.results?.map((item) => {
          return (
            <div key={item?._id} className="col-md-3  ">
              <div className="card h-100">
                <img
                  src={`${item?.picture?.secure_url}`}
                  className=" card-img-top"
                  alt="image"
                />
                <div className="card-body">
                  <h5 className="card-title">{item?.name}</h5>
                  <div className="card-text">
                    <p>Category: {item?.category?.name} </p>
                    <p>Price: {item?.price} </p>
                    <p>Available quantity: {item?.quantity} </p>
                    <p>
                      Description: {item?.description?.substring(0, 8)} ....{" "}
                    </p>
                  </div>
                </div>
                <div className=" d-flex justify-content-evenly">
                  <Link to={`/products/more-info/${item._id}`}>
                    <button className="btn btn-primary ">More info</button>
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
    </Layout>
  );
};

export default SearchResults;
