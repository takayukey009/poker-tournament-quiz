import React from 'react';

interface CategoryTabsProps {
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  currentCategory, 
  setCurrentCategory 
}) => {
  const categories = [
    { id: 'all', label: 'すべて' },
    { id: 'preflop', label: 'プリフロップ' },
    { id: 'flop', label: 'フロップ' },
    { id: 'turn', label: 'ターン' },
    { id: 'river', label: 'リバー' },
    { id: 'icm', label: 'ICM' },
  ];

  return (
    <div className="category-tabs overflow-x-auto">
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setCurrentCategory(category.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              currentCategory === category.id
                ? 'bg-white shadow'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
