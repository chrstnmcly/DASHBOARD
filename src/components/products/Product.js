import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../Redux/Actions/ProductActions";

const Product = (props) => {
  const { product } = props;
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure??")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
      <div className="card card-product-grid_orig shadow-sm_orig">
        <Link to="#" className="img-wrap_orig">
          <img src={product.image} alt="Product" />
        </Link>
        <div className="info-wrap_orig">
          <Link to="#" className="title_orig text-truncate_orig">
            <b>{product.name}</b>
          </Link>
          <div className="price_orig mb-2_orig">Php {product.price}</div>
          <div className="button-container_orig">
            <Link
              to={`/product/${product._id}/edit`}
              className="btn btn-edit_orig"
            >
              <i className="fas fa-pen"></i> Edit
            </Link>
            <Link
              to="#"
              onClick={() => deleteHandler(product._id)}
              className="btn btn-delete_orig"
            >
              <i className="fas fa-trash-alt"></i> Delete
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
