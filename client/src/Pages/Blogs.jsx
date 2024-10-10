import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Card from "./Components/Card";
import axios from "axios";
import { useMyContext } from "./ContextAPI/ContextApi";
import Pagination from "./Components/Pagination";
import CatButtons from "./Components/CatButtons";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { FaArrowDown } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

const Blogs = () => {
  const { API, searchValue, SetsearchValue } = useMyContext();
  const [blogs, Setblogs] = useState([]);
  const [unfilteredblogs, Setunfilteredblogs] = useState([]);

  // pagination

  const [currPage, SetcurrPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = blogs.slice(firstIndex, lastIndex);
  const npage = Math.ceil(blogs.length / recordsPerPage);
  const pageNumbers = [...Array(npage + 1).keys()].slice(1);
  const [category, Setcategory] = useState("All");

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const allBlogs = await axios.get(API + "blogs");
        Setblogs(allBlogs.data);
        Setunfilteredblogs(allBlogs.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllBlogs();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [records]);

  useEffect(() => {
    Setblogs(unfilteredblogs);
    Setcategory("All");
    if (searchValue === "") {
      Setblogs(unfilteredblogs);
      return; // Early return to avoid further processing
    }
    SetcurrPage(1);

    const filteredBlogs = unfilteredblogs.filter((b) => {
      const titleMatch = b.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      // Check if categories exist and filter
      const categoriesMatch =
        b.categories &&
        b.categories.some((category) =>
          category.toLowerCase().includes(searchValue.toLowerCase())
        );

      return titleMatch || categoriesMatch;
    });

    Setblogs(filteredBlogs);
  }, [searchValue]);

  useEffect(() => {
    SetcurrPage(1);
    Setblogs(unfilteredblogs);
    SetsearchValue("");
    if (category === "All") return Setblogs(unfilteredblogs);
    const filteredBlogs = unfilteredblogs.filter(
      (b) =>
        b.categories &&
        b.categories.some((c) =>
          c.toLowerCase().includes(category.toLowerCase())
        )
    );
    Setblogs(filteredBlogs);
  }, [category]);

  return (
    <div className="blogs-page container">
      <Accordion
        sx={{ flexShrink: 0, marginBottom: 4 }}
        slotProps={{ transition: { unmountOnExit: true } }}
      >
        <AccordionSummary
          expandIcon={<FaArrowDown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Popular Categories &nbsp;&nbsp;
          <FaFilter />
        </AccordionSummary>
        <AccordionDetails>
          <CatButtons Setcategory={Setcategory} category={category} />
        </AccordionDetails>
      </Accordion>
      {searchValue && (
        <h3>
          Results for "<b>{searchValue}"</b>
        </h3>
      )}
      {blogs.length == 0 ? (
        <strong>No Blogs</strong>
      ) : (
        records.map((b, i) => <Card key={i} b={b} />)
      )}
      {pageNumbers.length > 1 && (
        <Pagination
          pageNumbers={pageNumbers}
          currPage={currPage}
          SetcurrPage={SetcurrPage}
          npage={npage}
        />
      )}
    </div>
  );
};

export default Blogs;
