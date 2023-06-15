import React, { useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TopTotal = (props) => {
  const [productName, setProductName] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [text, setText] = useState("");
  const [wasteFormDataList, setWasteFormDataList] = useState([]);

  useEffect(() => {
    const storedWasteFormData = localStorage.getItem("wasteFormDataList");
    if (storedWasteFormData) {
      setWasteFormDataList(JSON.parse(storedWasteFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wasteFormDataList", JSON.stringify(wasteFormDataList));
  }, [wasteFormDataList]);

  const handleSubmitWaste = (e) => {
    e.preventDefault();

    const formData = {
      productName,
      wasteType,
      text,
      timestamp: new Date().toLocaleString(),
    };

    setWasteFormDataList([...wasteFormDataList, formData]);
    setProductName("");
    setWasteType("");
    setText("");
  };

  const [orderId, setOrderId] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [note, setNote] = useState("");
  const [discountFormDataList, setDiscountFormDataList] = useState([]);

  useEffect(() => {
    const storedDiscountFormData = localStorage.getItem("discountFormDataList");
    if (storedDiscountFormData) {
      setDiscountFormDataList(JSON.parse(storedDiscountFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("discountFormDataList", JSON.stringify(discountFormDataList));
  }, [discountFormDataList]);

  const handleSubmitDiscount = (e) => {
    e.preventDefault();

    const formData = {
      orderId,
      discountType,
      note,
    };

    setDiscountFormDataList([...discountFormDataList, formData]);
    setOrderId("");
    setDiscountType("");
    setNote("");
  };


  const { orders, products } = props;
  let totalSale = 0;
  if (orders) {
    orders.forEach((order) =>
      order.isPaid === true ? (totalSale = totalSale + order.totalPrice) : null
    );
  }

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const getSalesForDateRange = () => {
    if (orders && startDate && endDate) {
      const salesInRange = orders.reduce((totalSales, order) => {
        const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
        if (orderDate >= startDate && orderDate <= endDate && order.isPaid) {
          return totalSales + order.totalPrice;
        }
        return totalSales;
      }, 0);
      return salesInRange;
    }
    return 0;
  };

  const salesForDateRange = getSalesForDateRange();


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
  const generatePDF = () => {
    const tableContent = discountFormDataList
      .map((formData, index) => {
        return `
          <tr key="${index}">
            <td>${formData.orderId}</td>
            <td>${formData.discountType}</td>
            <td>${formData.note}</td>
          </tr>
        `;
      })
      .join('');

    const htmlContent = `
      <h5><b>Notes</b></h5>
      <table class="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Discount Type</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${tableContent}
        </tbody>
      </table>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Discount Report</title>
          <style>
            /* Add your custom styles for the printed PDF here */
            /* For example: */
            .table {
              border-collapse: collapse;
              width: 100%;
            }
            .table th, .table td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const generateWastePDF = () => {
    const tableData = wasteFormDataList.map((formData) => [
      formData.productName,
      formData.wasteType,
      formData.text,
      formData.timestamp,
    ]);
  
    const tableRows = tableData.map((row, index) => (
      `<tr key=${index}>
        ${row.map((cell, cellIndex) => `<td key=${cellIndex}>${cell}</td>`).join("")}
      </tr>`
    ));
  
    const tableHtml = `
      <h2>Waste Reports</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Waste Type</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Text</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Timestamp</th>
          </tr>
        </thead>
        <tbody>${tableRows.join("")}</tbody>
      </table>
    `;
  
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Waste Reports</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            table {
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          ${tableHtml}
        </body>
      </html>
    `;
  
    const pdfWindow = window.open("", "_blank");
    pdfWindow.document.open();
    pdfWindow.document.write(html);
    pdfWindow.document.close();
    pdfWindow.print();
  };
  const handleResetDiscount = () => {
    setDiscountFormDataList([]);
  };
  const handleResetWaste = () => {
    setWasteFormDataList([]);
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

      <div className="col-lg-3">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <div className="text">
              <h6 className="mb-1">
                <b>Sales for Date Range</b>
              </h6>
              <div className="d-flex align-items-center">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  className="custom-datepicker" // Add your custom CSS class here
                />
              </div>
              {startDate && endDate && (
                <span>
                  <b>Total Sales from:</b> {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}:{" "}
                  <b>Php {salesForDateRange.toFixed(2)}</b>
                </span>
              )}
              
            </div>
          </article>
        </div>
      </div>
      
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <form onSubmit={handleSubmitDiscount}>
            <div className="form-group mb-3 newStyle">
              <label htmlFor="orderId">
                <b>Order ID:</b>
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="form-control newStyle"
                placeholder="Enter order ID"
                required
              />
            </div>
            <div className="form-group mb-3 newStyle">
              <label htmlFor="discountType">
                <b>Discount Type:</b>
              </label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="form-control newStyle"
                required
              >
                <option value="">Select discount type</option>
                <option value="PWD">PWD</option>
                <option value="SENIOR">SENIOR</option>
              </select>
            </div>
            <div className="form-group mb-3 newStyle">
              <label htmlFor="note">
                <b>Note:</b>
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="form-control newStyle"
                placeholder="Enter a note"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary newStyle">
              Submit
            </button>
            
          </form>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="card card-body mb-4 shadow-sm">
          <h5><b>Discount Notes</b></h5>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Discount Type</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {discountFormDataList.map((formData, index) => (
                <tr key={index}>
                  <td>{formData.orderId}</td>
                  <td>{formData.discountType}</td>
                  <td>{formData.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={generatePDF} className="btn btn-primary newStyle">
            Generate PDF
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleResetDiscount}>
            Reset
          </button>
        </div>
      </div>


    <div className="col-lg-6">
      <div className="card card-body mb-4 shadow-sm">
      <h2 className="mt-4"><b>Waste Reports</b></h2>
      <form onSubmit={handleSubmitWaste}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name:
          </label>
          <select
            id="productName"
            className="form-select"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product.name}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="wasteType" className="form-label">
            Waste Type:
          </label>
          <select
            id="wasteType"
            className="form-select"
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
          >
            <option value="">Select a waste type</option>
            <option value="Overcooked">Overcooked</option>
            <option value="Undercooked">Undercooked</option>
            <option value="IncorrectToppings">Incorrect Toppings</option>
            <option value="Contaminated">Contaminated</option>
            <option value="MishandledOrder">Mishandled Order</option>
            <option value="QualityControlIssue">Quality Control Issue</option>
          </select>

        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">
            Other waste type:
          </label>
          <textarea
            id="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
    </div>

    <div className="col-lg-6">
      <div className="card card-body mb-4 shadow-sm">
      <h2 className="mt-4"><b>Waste Reports Table</b></h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Waste Type</th>
            <th>Text</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
        {wasteFormDataList.map((formData, index) => (
            <tr key={index}>
              <td>{formData.productName}</td>
              <td>{formData.wasteType}</td>
              <td>{formData.text}</td>
              <td>{formData.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={generateWastePDF} className="btn btn-primary newStyle">
            Generate PDF
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleResetWaste}>
            Reset
          </button>
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
