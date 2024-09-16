



const Loading = () => {
  return (
<div className=" h-100 d-flex justify-content-center">
        <div
          className="spinner-border align-self-center"
          style={{ width: "5rem", height: "5rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
</div>
  );
};

export default Loading;
