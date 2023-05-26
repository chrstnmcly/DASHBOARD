import React, { useState } from "react";

const TopTotal = (props) => {
  const { orders, products } = props;
  let totalSale = 0;
  if (orders) {
    orders.forEach((order) =>
      order.isPaid === true ? (totalSale = totalSale + order.totalPrice) : null
    );
  }

  const getTotalOrdersPerDay = () => {
    if (orders) {
      const ordersPerDay = {};
      orders.forEach((order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        if (ordersPerDay[date]) {
          ordersPerDay[date] += 1;
        } else {
          ordersPerDay[date] = 1;
        }
      });
      return ordersPerDay;
    }
    return {};
  };

  const getTotalSalesPerDay = () => {
    if (orders) {
      const salesPerDay = {};
      orders.forEach((order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        if (order.isPaid) {
          if (salesPerDay[date]) {
            salesPerDay[date] += order.totalPrice;
          } else {
            salesPerDay[date] = order.totalPrice;
          }
        }
      });
      return salesPerDay;
    }
    return {};
  };

  const ordersPerDay = getTotalOrdersPerDay();
  const salesPerDay = getTotalSalesPerDay();

  const [dailyReportData, setDailyReportData] = useState([]);
  const [weeklyReportData, setWeeklyReportData] = useState([]);
  const [showDailyTable, setShowDailyTable] = useState(true);
  const [showWeeklyTable, setShowWeeklyTable] = useState(true);


  const generateDailyReport = () => {
    const report = [];
    Object.keys(ordersPerDay)
      .sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      })
      .forEach((date) => {
        const orderCount = ordersPerDay[date];
        const sales = salesPerDay[date] || 0;
        report.push({
          date,
          orderCount,
          sales,
        });
      });
    setDailyReportData(report);
  };
  
  const generateWeeklyReport = () => {
    const weeklyReport = [];
    const weekMap = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };
    const dates = Object.keys(ordersPerDay);
    dates.sort((a, b) => new Date(a) - new Date(b));
  
    let currentWeek = "";
    let orderCount = 0;
    let sales = 0;
  
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const weekNumber = getWeekNumber(new Date(date));
      const weekday = new Date(date).getDay();
  
      if (currentWeek === "") {
        const month = new Date(date).toLocaleString('default', { month: 'long' }); // Fix: Declare the month variable
        currentWeek = `${month} - Week ${weekNumber}`;
      }
  
      if (weekMap[weekday] === "Sunday") {
        weeklyReport.push({
          week: currentWeek,
          orders: orderCount,
          sales: sales.toFixed(0),
        });
  
        orderCount = 0;
        sales = 0;
  
        const month = new Date(date).toLocaleString('default', { month: 'long' }); // Fix: Declare the month variable
        currentWeek = `${month} - Week ${weekNumber}`;
      }
  
      orderCount += ordersPerDay[date];
      sales += salesPerDay[date] || 0;
  
      if (i === dates.length - 1) {
        weeklyReport.push({
          week: currentWeek,
          orders: orderCount,
          sales: sales.toFixed(0),
        });
      }
    }
  
    setWeeklyReportData(weeklyReport);
  };
  

  const toggleDailyTable = () => {
    setShowDailyTable((prevShowDailyTable) => !prevShowDailyTable);
  };

  const toggleWeeklyTable = () => {
    setShowWeeklyTable((prevShowWeeklyTable) => !prevShowWeeklyTable);
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceFirstDay = Math.round(
      (date - firstDayOfYear + (firstDayOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000) /
        (1000 * 60 * 60 * 24)
    );
    return Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
  };

  const printPDF = (elementId) => {
    const table = document.getElementById(elementId);
    if (table) {
      const tableContent = table.innerHTML;
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`
        <html>
          <head>
            <title>REPORT</title>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid black; padding: 8px; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            ${tableContent}
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
    }
  };
  
  const DailyReportComponent = () => {
    return (
      <div className={`report-table-container ${showDailyTable ? "w-100" : "d-none"}`} id="daily-report">
        <h6 className="mb-1">
          <b>Report per day</b>
        </h6>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Order Count</th>
              <th scope="col">Sales</th>
            </tr>
          </thead>
          <tbody>
            {dailyReportData.map((data) => (
              <tr key={data.date}>
                <td>
                  <b>{data.date}</b>
                </td>
                <td>{data.orderCount}</td>
                <td>Php {data.sales.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={() => printPDF("daily-report")}>
          Print PDF
        </button>
      </div>
    );
  };
  

  const WeeklyReportComponent = () => {
    return (
      <div className={`report-table-container ${showWeeklyTable ? "w-100" : "d-none"}`} id="weekly-report">
        <h6 className="mb-1">
          <b>Report per week</b>
        </h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="table-header1">
                  <b>Week</b>
                </th>
                <th className="table-header1">
                  <b>Total Orders</b>
                </th>
                <th className="table-header1">
                  <b>Total Sales</b>
                </th>
              </tr>
            </thead>
            <tbody>
              {weeklyReportData.map((data) => (
                <tr key={data.week}>
                  <td>
                    <b>{data.week}</b>
                  </td>
                  <td>{data.orders}</td>
                  <td>Php {Number(data.sales).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => printPDF("weekly-report")}>
            Print PDF
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="row">
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-primary">
              <i className="text-primary fas fa-sack"></i>
            </span>
            <div className="text">
              <h6 className="mb-1"><b>Total Sales <i>(All time)</i></b></h6> 
              <span>Php {totalSale.toFixed(2)}</span>
            </div>
          </article>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-success">
              <i className="text-success fas fa-bags-shopping"></i>
            </span>
            <div className="text">
              <h6 className="mb-1"><b>Total Orders <i>(All time)</i></b></h6>
              {orders ? <span>{orders.length}</span> : <span>0</span>}
            </div>
          </article>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-warning">
              <i className="text-warning fas fa-shopping-basket"></i>
            </span>
            <div className="text">
              <h6 className="mb-1"><b>Total Products</b></h6>
              {products ? <span>{products.length}</span> : <span>0</span>}
            </div>
          </article>
        </div>
      </div>

      <div className="row d-flex">
        {/* Generate Daily Report */}
        <div className="col-md-6">
          <div className="card card-body mb-4 shadow-sm">
            <article className="icontext">
              <div className="text">
                <button className="btn btn-primary button-spacing" onClick={generateDailyReport}>
                  <b>Daily Report</b>
                </button>
                <button className="btn btn-secondary ml-2" onClick={toggleDailyTable}>
                  {showDailyTable ? "Hide table" : "Show table"}
                </button>
                {dailyReportData.length > 0 && <DailyReportComponent />}
              </div>
            </article>
          </div>
        </div>

        {/* Generate Weekly Report */}
        <div className="col-md-6">
          <div className="card card-body mb-4 shadow-sm">
            <article className="icontext">
              <div className="text">
                <button className="btn btn-primary button-spacing" onClick={generateWeeklyReport}>
                  <b>Weekly Report</b>
                </button>
                <button className="btn btn-secondary ml-2" onClick={toggleWeeklyTable}>
                  {showWeeklyTable ? "Hide table" : "Show table"}
                </button>
                {weeklyReportData.length > 0 && <WeeklyReportComponent />}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopTotal;
