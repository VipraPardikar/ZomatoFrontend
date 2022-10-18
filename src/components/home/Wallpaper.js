import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

function Wallpaper(props) {
  let navigate = useNavigate();
  let locationRef = useRef();
  let [locList, setLocList] = useState([]);
  let [restaurantList, setRestaurantList] = useState([]);
  let [selectLoc, setSelectLoc] = useState(null);
  let [restDisable, setRestDisabled] = useState(true);

  let getLocationList = async (event) => {
    let city = event.target.value;
    setSelectLoc(null);
    setRestDisabled(true);
    if (city === "" || city.length < 2) {
      setLocList([]);
      return false;
    }
    let URL = "https://zomato-v.herokuapp.com/api/get-location-by-city?city=" + city;
    try {
      let response = await axios.get(URL);
      let { location } = response.data;
      setLocList([...location]);
    } catch (error) {
      alert(error);
      console.log("error");
    }
  };

  let selectLocation = (location) => {
    location = JSON.parse(location);

    locationRef.current.value = `${location.name}, ${location.city}`;
    setSelectLoc({ ...location });
    setRestDisabled(false);
    setLocList([]);
  };

  let getRestaurantDetails = async (event) => {
    let restaurant = event.target.value;
    if (restaurant === "" || restaurant.length < 2) {
      setRestaurantList([]);
      return false;
    }
    let URL = `https://zomato-v.herokuapp.com/api/get-restaurant-by-location-id?lid=${selectLoc.location_id}&rest=${restaurant}`;
    try {
      let response = await axios.get(URL);
      let { result } = response.data;
      setRestaurantList([...result]);
    } catch (error) {
      alert(error);
      console.log("error");
    }
  };

  let goToRestaurant = (id) => {
    navigate("/restaurant/" + id);
  };

  return (
    <>
      <section className="row  main-section align-content-start">
        <Header bgColor="" />
        <section className="col-12 d-flex flex-column align-items-center justify-content-center">
          <p className="brand-name fw-bold my-lg-2 mb-0">e!</p>
          <p className="h1 text-white my-3 text-center">
            Find the best restaurants, cafés, and bars
          </p>
          <div className="search w-50 d-flex mt-3">
            <div className="w-50 input-group">
                <span className="input-group-text bg-white">
                <i class="fa fa-map-marker fa-1x text-danger"></i>
                </span>
              <input
                type="text"
                className="form-control mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3"
                placeholder="Select a location"
                onChange={getLocationList}
                ref={locationRef}
              />
              <ul
                className="list-group position-absolute w-100"
                style={{ top: "100%" }}
              >
                {locList.map((location) => {
                  return (
                    <li
                      className="list-group-item"
                      key={location._id}
                      onClick={() =>
                        selectLocation(`${JSON.stringify(location)}`)
                      }
                    >
                      {location.name}, {location.city}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="d-flex flex-column position-relative w-100">
              <div className="w-100 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-search text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control py-2 px-3 "
                  placeholder="Search for restaurants"
                  onChange={getRestaurantDetails}
                  disabled={restDisable}
                />
              </div>
              <ul
                className="list-group position-absolute w-100"
                style={{ top: "100%" }}
              >
                {restaurantList.map((restaurant) => {
                  return (
                    <li
                      className="list-group-item"
                      key={restaurant._id}
                      onClick={() => goToRestaurant(restaurant._id)}
                    >
                      <div className="rest-search-auto-complete d-flex ">
                        <img src={`/images/${restaurant.image}`} alt="" />
                        <div className="d-flex flex-column ms-3">
                          <p className="mb-0 fw-bold">{restaurant.name}</p>
                          <span className="small text-muted">
                            {restaurant.locality}, {restaurant.city}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Wallpaper;
