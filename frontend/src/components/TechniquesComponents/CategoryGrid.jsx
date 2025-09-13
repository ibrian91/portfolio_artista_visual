import React from 'react';
import { Card } from "@mui/material";
import { renderLogoContent } from '../../utils/techniquesUtils';

const CategoryGrid = ({ categories, onCategoryClick }) => {
  if (!categories || !Array.isArray(categories)) {
    return null;
  }

  return (
    <>
      {categories.map((category, index) => (
        <Card
          key={index}
          onClick={() => onCategoryClick(category)}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            width: "150px",
            height: "155px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          {renderLogoContent(category)}
        </Card>
      ))}
    </>
  );
};

export default CategoryGrid;
