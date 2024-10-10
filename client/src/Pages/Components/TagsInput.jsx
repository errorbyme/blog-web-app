import React, { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";

const TagsInput = ({ tags, Settags }) => {
  const [value, Setvalue] = useState("");
  const recommendations = [
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

  const addTags = (e) => {
    if (e.keyCode === 13) {
      Settags((prev) => [...prev, value.toString()]);
      Setvalue("");
    }
  };
  const deleteTag = (id) => {
    const updatedArray = tags.filter((item, i) => i !== id);
    Settags(updatedArray);
  };
  return (
    <div className="tag-input">
      <ul>
        {tags.map((t, i) => (
          <li key={i}>
            {t}
            <span>
              <CiCircleRemove onClick={() => deleteTag(i)} />
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={value}
        onChange={(e) => Setvalue(e.target.value)}
        onKeyDown={addTags}
        placeholder="Catogories -> [Enter to add new tags]"
        list="recommendations"
      />
      <datalist id="recommendations">
        {recommendations.map((recommendation, index) => (
          <option key={index} value={recommendation} />
        ))}
      </datalist>
    </div>
  );
};

export default TagsInput;
