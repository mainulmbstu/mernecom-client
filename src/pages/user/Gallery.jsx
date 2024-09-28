import axios from 'axios';
import { useEffect, useState } from 'react'
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from '../../components/Layout';




const Gallery = () => {
  let [gallery, setGallery] = useState([]);
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);


  let getGallery = async () => {
    // page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/gallery`,
        {
          params: {
            page: page,
            size: 8,
          },
        }
        );
        // console.log(gallery, data.total);
      setPage(page + 1);
      setTotal(data.total);
      setGallery([...gallery, ...data.images]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
     getGallery();
  }, []);



  return (
    <Layout title="Gallery">
      <InfiniteScroll
        dataLength={gallery?.length}
        next={getGallery}
        hasMore={gallery[0]?.picture?.length < total}
        loader={<h1>Loading...</h1>}
        endMessage={<h4 className=" text-center">All items loaded</h4>}
      >
        <div className="row mx-2">
          {gallery.length &&
            gallery[0]?.picture?.map((item, index) => {
              return (
                <div key={index} className="col-md-3 border text-center p-2">
                  <LazyLoadImage
                    src={`${import.meta.env.VITE_BASE_URL}/${item}`}
                    alt="image"
                    width={"100%"}
                    height={300}
                  />
                </div>
              );
            })}
        </div>
      </InfiniteScroll>
    </Layout>
  );
}

export default Gallery