import HomePage from "./components/home/HomePage";
import Restaurant from "./components/restaurant/Restaurant";
import SearchPage from "./components/search/SearchPage";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quick-search" element={<SearchPage />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
