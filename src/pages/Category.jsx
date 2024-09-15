import  { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

const Category = () => {
  const [products, setProducts] = useState([]);
    //   const [page, setPage] = useState(1);

    let params=useParams()
  let getProducts = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/category/${params.slug}`,
        {
          method: "GET",
        }
      );
      let data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [params.slug]);


  return (
    <Layout title={`Category-${params.slug}`}>
      <div>
        <div className="">
          <h3 className=" text-capitalize">
            Category: {params.slug}({products?.length}){" "}
          </h3>
          <h3 className=" text-danger">
            {!products?.length ? "No Product Found!!" : ""}
          </h3>
          <div className="row g-3">
            {products?.map((item) => {
              return (
                <div key={item._id} className="col-md-3  ">
                  <div className="card h-100">
                    <img
                      src={`${item?.picture?.secure_url}`}
                      className=" card-img-top"
                      height={200}
                      alt="image"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <div className="card-text">
                        <p className='m-0'>Category: {item.category.name} </p>
                        <p className='m-0'>Price: {item.price} </p>
                        <p className='m-0'>Available quantity: {item.quantity} </p>
                        <p className='m-0'>
                          Description: {item.description.substring(0, 8)} ...
                        </p>
                      </div>
                    </div>
                    <div className=" d-flex justify-content-evenly">
                      <Link to={`/products/more-info/${item._id}`}>
                        <button
                          // onClick={() => navigate(`products/more-info/${item?._id}`)}
                          className="btn btn-primary "
                        >
                          More info
                        </button>
                      </Link>
                      <button className="btn btn-info mt-auto mb-1">
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
}

export default Category