import React, { useEffect, useRef, useState } from "react";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderDetailInfo from "./OrderDetailInfo";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deliverOrder, getOrderDetails } from "../../Redux/Actions/OrderActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import moment from "moment";
import { PayPalButton } from "react-paypal-button-v2";
import axios from "axios";
import { ORDER_PAY_RESET } from "../../Redux/Constants/OrderConstants";
import { payOrder } from "../../Redux/Actions/OrderActions";

const OrderDetailMain = (props) => {
  const { orderId } = props;
  const successPay = false;
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  const paypalRef = useRef();

  const printOrder = () => {
    const content = document.getElementById("order-content").innerHTML;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    const printWindow = iframe.contentWindow;
    doc.open();
    doc.write(
      "<html><head><title>Order Details</title><style>table { width: 100%; border-collapse: collapse; } th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }</style></head><body>"
    );
    doc.write("<table>");
    doc.write(content);
    doc.write("</table>");
    doc.write("</body></html>");
    doc.close();
    printWindow.focus();
    printWindow.print();
    document.body.removeChild(iframe);
  };

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, order]);

  return (
    <section className="content-main">
      <div className="content-header">
        <Link to="/orders" className="btn btn-dark text-white">
          Back To Orders
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger">{error}</Message>
      ) : (
        <div className="card">
          <header className="card-header p-3 Header-green">
            <div className="row align-items-center ">
              <div className="col-lg-6 col-md-6">
                <span>
                  <i className="far fa-calendar-alt mx-2"></i>
                  <b className="text-white">
                    {moment(order.createdAt).format("llll")}
                  </b>
                </span>
                <br />
                <small className="text-white mx-3 ">
                  Order ID: {order._id}
                </small>
              </div>
              <div className="col-lg-6 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                <button className="btn btn-success ms-2" onClick={printOrder}>
                  <i className="fas fa-print"></i>
                </button>
              </div>
            </div>
          </header>
          <div className="card-body">
            {/* Order info */}
            <OrderDetailInfo order={order} />

            <div className="row">
              <div className="col-lg-9">
                <div className="table-responsive" id="order-content">
                  <OrderDetailProducts order={order} loading={loading} />
                </div>
              </div>
              {/* Payment Info */}
              <div className="col-lg-3">
                <div className="box shadow-sm bg-light">
                  {order.isDelivered ? (
                   <div>
                   <button className="btn btn-success col-12">
                     DELIVERED AT ({moment(order.isDeliveredAt).format("MMM Do YY")})
                   </button>
                   <div style={{ marginTop: '10px' }}>
                    <br />
                    <h6 style={{ textAlign: 'center' }}><b>Only use this button for PATC customers & COD orders</b></h6>
                    <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                  </div>
                 </div>
                 
                  ) : (
                    <>
                      {order.paymentMethod === "cashOnDelivery" ? (
                        <div>
                          <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                          <button onClick={deliverHandler} className="btn btn-dark col-12">
                            MARK AS DELIVERED
                          </button>
                        </div>
                      ) : (
                        <button onClick={deliverHandler} className="btn btn-dark col-12">
                          MARK AS DELIVERED
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderDetailMain;
