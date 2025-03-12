import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"

import axios from "axios";
import myqr from "../component/myqr.jpg";

const PaymentPage: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  useEffect(() => {
    setLoading(true);
    const user_id = state.account_id;
    const movie_id = state.movieId;
    const showtime_id = state.showtimeId;
    const payment_type = "credit_card";
    fetch("http://localhost:8000/minorcineflex/base_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id,
        movie_id,
        showtime_id,
        payment_type,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load payment details");
        }
        return response.json();
      })
      .then((data) => {
        setPaymentDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handlePayment = () => {
    const user_id = state.account_id;
    const movie_id = state.movieId;
    const showtime_id = state.showtimeId;
    const payment_type = "credit_card";
    setLoading(true);

    axios
      .post("http://localhost:8000/minorcineflex/done_payment", {
        user_id,
        movie_id,
        showtime_id,
        payment_type,
      })
      .then((response) => {
        setIsPaid(true);
        state.movieId = null;
        state.showtimeId = null;
        navigate("/", { state });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error processing payment:", error);
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4 items-center h-5/6 w-full">
      {/* Movie Poster */}
      {/* Movie Poster */}
      <img
        src={paymentDetails.movie_img}
        alt="Movie Poster"
        className="shadow-md w-full sm:w-2/4 md:w-1/3 lg:w-1/4 max-w-xs"
      />

      {/* Payment Details */}
      <div className="relative flex flex-col items-center gap-4 w-full h-auto text-bt-main bg-bg-sec shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold">Confirm Your Payment</h2>



        {/* Table */}
        <div className="w-full max-h-96 overflow-auto">
          <table className="w-full text-left table-auto overflow-auto">
            <thead>
              <tr>
                <th className="p-2 md:p-4 border-b border-bt-main">
                  <p className="text-sm md:text-md text-bt-main">Name</p>
                </th>

                <th className="p-2 md:p-4 border-b border-bt-main">
                  <p className="text-sm md:text-md text-bt-main"> Price</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentDetails.reserved_seats.map((seat: string, index: number) => (
                <tr key={index}>
                  <td className="p-2 md:p-4">
                    <p className="text-xs md:text-sm">Seat {seat.seat_id}</p>
                  </td>

                  <td className="p-2 md:p-4">
                    <p className="text-xs md:text-sm"> {seat.price}</p>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          <h1 className="px-4 w-full bg-bt-main text-bg-main text-lg md:text-xl py-2 uppercase block text-center">
            Total: {paymentDetails.total_price} ฿
          </h1>
        </div>


        {/* QR Code */}
        <img src={myqr} alt="QR Code" className="md:w-2/5 lg:w-1/4 object-contain" />

        {/* Payment Button */}
        {isPaid ? (

          <p className="text-green-500 font-semibold text-lg">Payment Successful! 🎉</p>
        ) : (
          <button
            onClick={handlePayment}
            className="bg-bt-main text-bg-main py-2 px-4 md:px-8 rounded-xl uppercase"
          >
            Pay Now
          </button>
        )}
      </div>
    </div >
  );
};

export default PaymentPage;