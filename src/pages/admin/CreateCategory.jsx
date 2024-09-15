import AdminMenu from "./AdminMenu";
import UpdateCategory from "./updateCategory";
import { useAuth } from "../../context/AuthContext";
import CategoryTable from "../../components/CategoryTable";
import { toast } from "react-toastify";
import { useState } from "react";
import DeleteModal from "../../components/DeleteModal";
import Layout from "../../components/Layout";

const CreateCategory = () => {
  let { category, token, getCategory } = useAuth();
  const [selectedCat, setSelectedCat] = useState({});
  //============================================================
  const [delId, setDelId] = useState("");

  let deleteCategory = async (id, name) => {
    let res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/category/delete-category/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    let data = await res.json();
    if (res.ok) {
      getCategory();
      toast.success(`${name} is deleted successfully`);
    } else {
      toast.success(data.msg);
    }
  };
  //====================================================================

  return (
    <Layout title={"category"}>
      <div className="row ">
        <div className="col-md-3 p-2">
          <div className="card p-2">
            <AdminMenu />
          </div>
        </div>
        <div className=" col-md-9 p-2">
          <div className=" card p-2">
            <div>
              <CategoryTable />
            </div>
            <div>
              <h3>Category List ({category.length}) </h3>
              <div className=" border">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">SL</th>
                      <th scope="col">Name</th>
                      <th scope="col">Update</th>
                      <th scope="col">Delete</th>
                      <th scope="col">Updated Time</th>
                    </tr>
                  </thead>
                  <tbody className=" text-capitalize">
                    {category.length > 0 &&
                      category.map((cat, index) => {
                        return (
                          <tr key={cat._id}>
                            <td>{index + 1}</td>
                            <td>{cat.name}</td>
                            <td>
                              <button
                                onClick={() => setSelectedCat({ cat })}
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#updateCategory"
                              >
                                Update
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => setDelId(cat._id)}
                                type="button"
                                className="btn btn-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteCategory"
                              >
                                Delete
                              </button>
                            </td>

                            <td>{new Date(cat.updatedAt).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <UpdateCategory
                  selectedCat={selectedCat}
                  setSelectedCat={setSelectedCat}
                />
              </div>
              <DeleteModal deleteCategory={deleteCategory} delId={delId} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
