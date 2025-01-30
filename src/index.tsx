import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter , RouterProvider } from 'react-router-dom' ;
import './index.css';
import HomePage from './Home/homepage.tsx';
import LoginPage from './Login/loginpage.tsx'
import ProfilePage from './Profile/profilepage.tsx';
import TheaterPage from './Theater/theaterpage.tsx';
import SeatPage from './Seat/seatpage.tsx';
import FoodPage from './Food/foodpage.tsx';
import PaymentPage from './Payment/paymentpage.tsx';
import AdminPage from './Admin/adminpage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },
  {
    path: "Login",
    element: <LoginPage/>
  },
  {
    path: "Profile",
    element: <ProfilePage/>
  },
  {
    path: "Theater",
    element: <TheaterPage/>
  },
  {
    path: "Seat",
    element: <SeatPage/>
  },
  {
    path: "Food",
    element: <FoodPage/>
  },
  {
    path: "Payment",
    element: <PaymentPage/>
  },
  {
    path: "Admin",
    element: <AdminPage/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);