import React, { useEffect, useState } from "react";
import axios from "axios";
import QuickSearchItem from "./QuickSearchItem";

function QuickSearch() {
  let [mealType, setMealType] = useState([]);
  let getQuickSearchData = async () => {
    let URL = "https://zomato-v.herokuapp.com/api/get-meal-types";
    try {
      let response = await axios.get(URL);
      let { status, meal_type } = response.data;
      if (status) {
        setMealType([...meal_type]);
      } else {
        alert("Meal Types Not found");
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  // initialization ==> component created
  // mounting ===> component loaded
  // useEffect ==> hook it runs on side-effect in component
  useEffect(() => {
    getQuickSearchData();
  }, []);
  return (
    <>
      <section className="row justify-content-center">
        <section className="col-10 mt-4">
          <h3 className="fw-bold text-navy">Quick Searches</h3>
          <p className="text-secondary">Discover restaurants by type of meal</p>
        </section>
        <section className="col-10">
          <section className="row py-2">
            <section className="col-12 px-0 d-flex justify-content-between flex-wrap">
              {mealType.map((meal) => {
                return <QuickSearchItem meal={meal} key={meal._id} />;
              })}
            </section>
          </section>
        </section>
      </section>
    </>
  );
}

export default QuickSearch;
