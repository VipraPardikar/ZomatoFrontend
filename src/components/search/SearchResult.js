import React from "react";
import SearchResultItem from "./SearchResultItem";
import Pagination from "./Pagination";

function SearchResult(props) {
  let { searchList, filterData, pageCount } = props;
  console.log(searchList);
  return (
    <>
      <div className="col-12 col-lg-8 col-md-7">
        {searchList.map((item, index) => {
          return <SearchResultItem key={index} item={item} />;
        })}
        <Pagination filterData={filterData} pageCount={pageCount} />
      </div>
    </>
  );
}

export default SearchResult;
