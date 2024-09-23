import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Detail from "./views/Detail";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/detail.css";
import Layout from "./layouts/Layout"; // Import Layout component
import Drama from "./components/Drama";
import Actor from "./components/Actor";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout */}

        <Route path="/detail" element={<Detail />} />

        {/* Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="drama" element={<Drama />} />
          <Route path="actor" element={<Actor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
