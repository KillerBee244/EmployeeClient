// src/country/CountryRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CountryIndex from "./CountryIndex";

export default function CountryRoutes() {
  return (
    <Routes>
      {/* /countries/ */}
      <Route path="/" element={<CountryIndex />} />
      {/* sau này có thể thêm detail: /countries/:id */}
    </Routes>
  );
}
