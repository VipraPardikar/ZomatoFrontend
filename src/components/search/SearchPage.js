import SearchFilter from "./SearchFilter";
import SearchResult from "./SearchResult";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Header from "../Header";

function SearchPage() {
  let [searchParams] = useSearchParams();
  let [filter, setFilter] = useState({});
  let [searchList, setSearchList] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [pageCount, setPageCount] = useState(0);
  let getFilterDetails = async (_filter) => {
    _filter = { ..._filter };
    let URL = "https://zomato-v.herokuapp.com/api/filter";

    //filter
    if (searchParams.get("meal_type"))
      _filter["mealtype"] = searchParams.get("meal_type");

    try {
      let response = await axios.post(URL, _filter);
      let { result, pageCount } = response.data;
      setSearchList(...[result]);
      setPageCount(pageCount);
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };

  let getLocationList = async () => {
    let URL = "https://zomato-v.herokuapp.com/api/get-location";
    try {
      let response = await axios.get(URL);
      let data = response.data;
      setLocationList([...data.location]);
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };

  let filterData = (event, option) => {
    let { value } = event.target;
    let _filter = {};
    switch (option) {
      case "location":
        _filter["location"] = value;
        break;
      case "sort":
        _filter["sort"] = value;
        break;
        case "cuisine":
          let checked = event.target.checked;
          // console.log(checked);
  
          let cuisine =
            filter.cuisine == undefined ? [] : [...filter.cuisine];
          if (checked) {
            let isAvailable = cuisine.includes(Number(value));
            if (isAvailable === false) cuisine.push(Number(value));
          } else {
            let position = cuisine.indexOf(Number(value));
            cuisine.splice(position, 1);
          }
          if (cuisine.length > 0) {
            _filter["cuisine"] = cuisine;
          }
  
          break;
      case "cost":
        let cost = value.split("-");
        _filter["lcost"] = cost[0];
        _filter["hcost"] = cost[1];
        break;
      case "page":
        _filter["page"] = value;
        break;
        default: break;
    }

    
    setFilter({ ...filter, ..._filter });
  };

  // mounting
  useEffect(() => {
    getLocationList();
  }, []);

  // mounting & update of filter
  useEffect(() => {
    getFilterDetails(filter);
  }, [filter]);

  return (
    <>
      <div className="row justify-content-center">
        <Header bgColor="bg-danger" />
      </div>
      {/* <!-- section --> */}
      <div className="row">
        <div className="col-12 px-5 pt-4">
          <p className="h3">Breakfast Places In Mumbai</p>
        </div>
        {/* <!-- food item --> */}
        <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
          <SearchFilter locationList={locationList} filterData={filterData} />
          {/* <!-- search result --> */}
          <SearchResult searchList={searchList} filterData={filterData}  pageCount={pageCount} />
        </div>
      </div>
    </>
  );
}
export default SearchPage;
