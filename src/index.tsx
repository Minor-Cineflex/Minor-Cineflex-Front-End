import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter , RouterProvider } from 'react-router-dom' ;
import './index.css';
import HomePage from './Home/homepage.tsx';
import LoginPage from './Login/loginpage.tsx'
import ProfilePage from './Profile/profilepage.tsx';
import TheaterPage from './Theater/theaterpage.tsx';
import SeatPage from './Seat/seatpage.tsx';
import PaymentPage from './Payment/paymentpage.tsx';
import AdminPage from './Admin/adminpage.tsx';
import CinemaPage from './Cinema/Cinema.tsx';
import MoivePage from './Moive/moivepage.tsx'

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
    path: "Profile/:account_id",
    element: <ProfilePage/>
  },
  {
    path: "Theater",
    element: <TheaterPage/>
  },
  {
    path: "Theater/:cinema_id/:movie_id",
    element: <TheaterPage/>
  },
  {
    path: "Seat",
    element: <SeatPage/>
  },
  {
    path: "Seat/:cinema_id/:moviename/:theater_id",
    element: <SeatPage/>
  },
  {
    path: "Payment",
    element: <PaymentPage/>
  },
  {
    path: "Admin",
    element: <AdminPage/>
  },
  {
    path: "Cinema",
    element: <CinemaPage/>
  },
  {
    path: "Cinema/:moviename",
    element: <CinemaPage/>
  },
  {
    path: "Movie",
    element: <MoivePage/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);