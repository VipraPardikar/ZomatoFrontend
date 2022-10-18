import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function Restaurant(props) {
  let userNameRef = useRef();
  let emailRef = useRef();
  let addressRef = useRef();
  let params = useParams();
  let initRest = {
    aggregate_rating: 0,
    city: "",
    city_id: 0,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "",
    locality: "",
    location_id: 0,
    mealtype_id: 0,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: "-1",
  };
  let [rDetails, setRDetails] = useState({ ...initRest });
  let [isContact, setIsContact] = useState(false);
  let [subTotal, setSubTotal] = useState(0);
  let [menuItem, setMenuItem] = useState([]);
  let onChangeHandler = () => {};

  let loadScript = async () => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://checkout.razorpay.com/v1/checkout.js";
    scriptElement.onload = () => {
      return true;
    };
    scriptElement.onerror = () => {
      return false;
    };
    document.body.appendChild(scriptElement);
  };

  let makePayment = async () => {
    let isLoaded = await loadScript();
    if (isLoaded === false) {
      alert("Unable load payment sdk");
      return false;
    }

    let URL = "https://zomato-v.herokuapp.com/api/payment";

    let sendData = {
      amount: subTotal,
      email: emailRef.current.value,
    };

    let { data } = await axios.post(URL, sendData);
    let { order } = data;

    var options = {
      key: "rzp_test_g0A8IkNzyF9sw2",
      amount: order.amount,
      currency: "INR",
      name: "Payment",
      description: "Order Payment",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/2/2d/Zomato_Logo.jpg",
      order_id: order.id,
      handler: async function (response) {
        let URL = "https://zomato-v.herokuapp.com/api/callback";
        let sendData = {
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
        };

        let { data } = await axios.post(URL, sendData);
        if (data.status === true) {
          alert(
            "Congratulations, your order is placed, payment received successfully."
          );
          window.location.assign("/"); //send home page
        } else {
          alert("payment files, try again.");
        }
      },
      prefill: {
        name: "Vipra Pardikar",
        email: "vipra@gmail.com",
        contact: "9999999999",
      },
    };
    var paymentObject = new window.Razorpay(options);
    paymentObject.open();

    console.log("hello");
  };

  let getRestaurantDetails = async () => {
    let URL = "https://zomato-v.herokuapp.com/api/get-restaurant-by-id/" + params.id;
    try {
      let response = await axios.get(URL);
      let data = response.data;
      if (data.status === true) {
        setRDetails({ ...data.result });
      } else {
        setRDetails({ ...initRest });
      }
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };
  let getMenuList = async () => {
    let URL = "https://zomato-v.herokuapp.com/api/get-menu-item?rid=" + params.id;
    try {
      let response = await axios.get(URL);
      let data = response.data;
      if (data.status === true) {
        setMenuItem([...data.menu_items]);
      } else {
        alert("menu items not found");
      }
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };
  let incMenuItemCount = (index) => {
    let _menuItem = [...menuItem];
    _menuItem[index].qty += 1;
    setMenuItem(_menuItem);
  };
  let decMenuItemCount = (index) => {
    let _menuItem = [...menuItem];
    _menuItem[index].qty -= 1;
    setMenuItem(_menuItem);
  };
  // on mounting
  useEffect(() => {
    getRestaurantDetails();
  }, []);

  useEffect(() => {
    let subTotal = menuItem.reduce((pValue, cValue) => {
      return pValue + cValue.price * cValue.qty;
    }, 0);
    setSubTotal(subTotal);
  }, [menuItem]);

  return (
    <>
      <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <Carousel showThumbs={false} infiniteLoop={true}>
                {rDetails.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/images/" + value} />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {rDetails.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuItem.map((item, index) => {
                return (
                  <div className="row p-2" key={index}>
                    <div className="col-8">
                      <p className="mb-1 h6">{item.name}</p>
                      <p className="mb-1">{item.price}</p>
                      <p className="small text-muted">{item.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + item.image} alt="" />
                        {item.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => incMenuItemCount(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => decMenuItemCount(index)}
                            >
                              -
                            </span>
                            <span>{item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => incMenuItemCount(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
                );
              })}

              {subTotal === 0 ? null : (
                <div className="d-flex justify-content-between">
                  <h3>Subtotal {subTotal}</h3>
                  <button
                    className="btn btn-danger"
                    data-bs-target="#exampleModalToggle2"
                    data-bs-toggle="modal"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {rDetails.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter full Name"
                  value="viprapardikar"
                  ref={userNameRef}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value="vipra.p@gmail.com"
                  ref={emailRef}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value="Nagpur"
                  ref={addressRef}
                  onChange={onChangeHandler}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button className="btn btn-success" onClick={makePayment}>
                PROCEED
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <Header bgColor="bg-danger" />
      </div>
      {/* <!-- section --> */}
      <div className="row justify-content-center">
        <div className="col-10">
          <div className="row">
            <div className="col-12 mt-5">
              <div className="restaurant-main-image position-relative">
                <img src={"/images/" + rDetails.image} alt="" className="" />
                <button
                  className="btn btn-outline-light position-absolute btn-gallery"
                  data-bs-toggle="modal"
                  data-bs-target="#slideShow"
                >
                  Click To Get Image Gallery
                </button>
              </div>
            </div>
            <div className="col-12">
              <h3 className="mt-4">{rDetails.name}</h3>
              <div className="d-flex justify-content-between">
                <ul className="list-unstyled d-flex gap-3">
                  <li
                    className={
                      isContact === false
                        ? "cursor-pointer contact fw-bold"
                        : "hand"
                    }
                    onClick={() => setIsContact(false)}
                  >
                    Overview
                  </li>
                  <li
                    className={
                      isContact === true
                        ? " contact fw-bold "
                        : "hand"
                    }
                    onClick={() => setIsContact(true)}
                  >
                    Contact
                  </li>
                </ul>
                <a
                  className="btn btn-danger align-self-start"
                  data-bs-toggle="modal"
                  href="#exampleModalToggle"
                  role="button"
                  onClick={getMenuList}
                >
                  Place Online Order
                </a>
              </div>
              <hr className="mt-0" />
              {isContact === false ? (
                <div className="over-view">
                  <p className="h5 mb-4">About this place</p>

                  <p className="mb-0 fw-bold">Cuisine</p>
                  <p>
                    {rDetails.cuisine
                      .reduce((pV, cV) => pV + ", " + cV.name, "")
                      .substring(2)}
                  </p>

                  <p className="mb-0 fw-bold">Average Cost</p>
                  <p>₹{rDetails.min_price} for two people (approx.)</p>
                </div>
              ) : (
                <div className="over-view">
                  <p className="mb-0 fw-bold">Phone Number</p>
                  <p>+{rDetails.contact_number}</p>

                  <p className="mb-0 fw-bold">Address</p>
                  <p>
                    {rDetails.locality},{rDetails.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Restaurant;
