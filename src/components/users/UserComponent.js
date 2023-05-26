import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listUser, updateUserStatus } from "../../Redux/Actions/userActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const UserComponent = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const [sortOrder, setSortOrder] = useState("asc");
  const [hiddenUsers, setHiddenUsers] = useState(() => {
    const storedHiddenUsers = localStorage.getItem("hiddenUsers");
    return storedHiddenUsers ? JSON.parse(storedHiddenUsers) : [];
  });

  useEffect(() => {
    dispatch(listUser());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("hiddenUsers", JSON.stringify(hiddenUsers));
  }, [hiddenUsers]);

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const handleHide = (userId) => {
    if (window.confirm("Are you sure you want to hide this user?")) {
      dispatch(updateUserStatus(userId, "delisted"));
      setHiddenUsers((prevHiddenUsers) => [...prevHiddenUsers, userId]);
    }
  };

  let sortedUsers = [];
  if (Array.isArray(users)) {
    sortedUsers = [...users].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Customers</h2>
        <div>
          <button className="btn btn-primary" onClick={handleSort}>
            Sort by Date{" "}
            <i
              className={`bi bi-arrow-${
                sortOrder === "asc" ? "up" : "down"
              }`}
            ></i>
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <header className="card-header">
          <div className="row gx-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input type="text" placeholder="Search..." className="form-control" />
            </div>
          </div>
        </header>

        {/* Table */}
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="fs-5">Name</th>
                  <th className="fs-5">Email</th>
                  <th className="fs-5">Role</th>
                  <th className="fs-5">Created At</th>
                  <th className="fs-5">Updated At</th>
                  <th className="fs-5">Status</th>
                  <th className="fs-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => {
                  const isHidden = hiddenUsers.includes(user._id);
                  const status = isHidden ? "Delisted" : "Active";
                  const statusColor = isHidden ? "text-danger" : "text-success";

                  return (
                    <tr key={user._id}>
                      <td>
                        <b>{user.name}</b>
                      </td>
                      <td>
                        <a>{user.email}</a>
                      </td>
                      <td>{user.isAdmin ? "Admin" : "Customer"}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                      <td className={statusColor}>{status}</td>
                      <td>
                        {!isHidden && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleHide(user._id)}
                          >
                            Mark as Delisted
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <nav className="float-end mt-4" aria-label="Page navigation">
            <ul className="pagination">
              <li className="page-item disabled">
                <Link className="page-link" to="#">
                  Previous
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" to="#">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default UserComponent;
