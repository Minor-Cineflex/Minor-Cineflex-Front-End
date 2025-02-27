import React from "react";
import myqr from "../component/myqr.jpg";

const PaymentPage: React.FC = () => {
  return (
    <div className="flex p-4 gap-4 items-center h-screen w-full">
      <img
        src="https://m.media-amazon.com/images/I/81kz06oSUeL._AC_SL1500_.jpg"
        alt=""
        className="shadow-md w-1/4"
      />

      <div className="relative flex flex-col items-center gap-4 w-full h-4/5 overflow-scroll text-bt-main bg-bg-sec shadow-md rounded-xl min-h-96">
        <div className="w-full">
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="p-4 border-b border-bt-main">
                  <p className="block  text-md text-bt-main">Name</p>
                </th>
                <th className="p-4 border-b border-bt-main">
                  <p className="block  text-md text-bt-main">amount</p>
                </th>
                <th className="p-4 border-b border-bt-main">
                  <p className="block  text-md text-bt-main">sum price</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 ">
                  <p className="text-sm ">normal seat a1-a3</p>
                </td>
                <td className="p-4  ">
                  <p className="text-sm">1</p>
                </td>
                <td className="p-4">
                  <p className="text-sm">100</p>
                </td>
              </tr>
            </tbody>
          </table>
          <h1 className="px-4 w-full bg-bt-main text-bg-main text-xl py-2 uppercase block">
            total 100
          </h1>
        </div>
        <div className=" flex justify-center items-center m-4 h-3/5">
          <img
            src={myqr}
            alt=""
            className="w-full h-full object-contain
"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
