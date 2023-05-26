import React from "react";
import TopTotal from "./TopTotal";
import LatestOrder from "./LatestOrder";
import PerMonthStatistics from "./PerMonthStatistics";
import PerDayStatistics from "./PerDayStatistics";
import PerYearStatistics from "./PerYearStatistics";
import PerWeekStatistics from "./PerWeekStatistics";
import { useSelector } from "react-redux";

const Main = () => {
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const productList = useSelector((state) => state.productList);
  const { products } = productList;
  return (
    <>
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title"> Dashboard </h2>
        </div>
        {/* Top Total */}
        <TopTotal orders={orders} products={products} />

        <div className="row">
          {/* STATICS */}
          <PerYearStatistics />
          <PerMonthStatistics />
          <PerWeekStatistics />
          <PerDayStatistics />
        </div>

        {/* LATEST ORDER */}
        <div className="card mb-4 shadow-sm">
          <LatestOrder orders={orders} loading={loading} error={error} />
        </div>
      </section>
    </>
  );
};

export default Main;
