import { useState } from 'react';

function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
            activeCategory === category
              ? 'bg-sky-500 text-white shadow-lg scale-105'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;