import { Button } from "@mui/material";
import React from "react";

const CatButtons = ({ Setcategory, category }) => {
  const blogCategories = [
    "All",
    "Lifestyle",
    "Food & Cooking",
    "Health & Fitness",
    "Technology",
    "Travel",
    "Finance",
    "Fashion & Beauty",
    "Parenting",
    "Home & Garden",
    "Entertainment",
    "Education & Learning",
    "Politics & Current Events",
  ];
  return (
    <div className="categories-btns">
      {blogCategories.map((c, i) => (
        <Button
          className="c-btn"
          variant={`${category == c ? "contained" : "outlined"}`}
          color="secondary"
          onClick={(e) => Setcategory(c)}
          key={i}
        >
          {c}
        </Button>
      ))}
    </div>
  );
};

export default CatButtons;
