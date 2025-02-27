import React from "react";
import Data from "../../test.json";
const testData = Data;

export default function Footerbar() {
  return (
    <footer>
      <div className="p-4"></div>
      <div className="w-full p-4 px-16 text-xl text-bt-main font-black bg-bt-sec absolute bottom-0 flex uppercase gap-3 z-50">
        <p>buy ticket</p> |
        <select
          id="countries"
          className="bg-bg-main border border-bt-main text-bt-main  text-sm rounded-lg block py-1 px-2.5"
        >
          <option selected>Chose moive</option>
          {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list.map(
            (movie) => (
              <>
                <option value={movie.name}>{movie.name}</option>
              </>
            )
          )}
        </select>{" "}
        at
        <select
          id="countries"
          className="bg-bg-main border border-bt-main text-bt-main  text-sm rounded-lg block py-1 px-2.5"
        >
          <option selected>Therter</option>
          {testData.MinorCineflex.cinema_list.map((cinema) => (
            <>
              <option value={cinema.name}>{cinema.name}</option>
            </>
          ))}
        </select>
      </div>
    </footer>
  );
}
