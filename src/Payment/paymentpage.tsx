import React from "react";
import myqr from "../component/myqr.jpg";

const PaymentPage: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4 items-center h-screen w-full">
      {/* Image Section */}
      <img
        src="https://m.media-amazon.com/images/I/81kz06oSUeL._AC_SL1500_.jpg"
        alt=""
        className="shadow-md w-full sm:w-2/4 md:w-1/3 lg:w-1/4 max-w-xs"
      />

      {/* Payment Details */}
      <div className="relative flex flex-col items-center gap-4 w-full  h-auto  text-bt-main bg-bg-sec shadow-md rounded-xl p-4">
        {/* Table */}
        <div className="w-full ">
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="p-2 md:p-4 border-b border-bt-main">
                  <p className="text-sm md:text-md text-bt-main">Name</p>
                </th>
                <th className="p-2 md:p-4 border-b border-bt-main">
                  <p className="text-sm md:text-md text-bt-main">Amount</p>
                </th>
                <th className="p-2 md:p-4 border-b border-bt-main">
                  <p className="text-sm md:text-md text-bt-main">Sum Price</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 md:p-4">
                  <p className="text-xs md:text-sm">Normal seat A1-A3</p>
                </td>
                <td className="p-2 md:p-4">
                  <p className="text-xs md:text-sm">1</p>
                </td>
                <td className="p-2 md:p-4">
                  <p className="text-xs md:text-sm">100</p>
                </td>
              </tr>
            </tbody>
          </table>
          <h1 className="px-4 w-full bg-bt-main text-bg-main text-lg md:text-xl py-2 uppercase block text-center">
            Total 100
          </h1>
        </div>

        <img
          src={myqr}
          alt="QR Code"
          className=" md:w-2/5 lg:w-1/4 object-contain"
        />

        <button className="bg-bt-main text-bg-main py-2 px-4 md:px-8 rounded-xl uppercase ">
          paid
        </button>
      </div>
    </div >
  );
};

export default PaymentPage;