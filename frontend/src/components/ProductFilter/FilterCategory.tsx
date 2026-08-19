import React from 'react'
import { ChevronUp } from "lucide-react";

type FilterCategoryProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
const FilterCategory = ({ title, children, onToggle, isOpen }: FilterCategoryProps) => {
  return (
    <div className="product-filter__category">
      <button
        type="button"
        className="product-filter__category-header"
        onClick={ onToggle }
      >
        <span>{ title }</span>
        <ChevronUp className={ isOpen ? "" : "rotate-180" } size={ 16 }/>
      </button>
      <div
        className={ `product-filter__category-list ${
          isOpen ? "product-filter__category-list--open" : "" }` }
      >
        <div>
          { children }
        </div>
      </div>
    </div>
  )
}
export default FilterCategory;