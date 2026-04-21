import React, {useEffect, useState} from "react";
import ArrowD from "../../public/images/icons/down_arrow.svg";
import ArrowU from "../../public/images/icons/up_arrow.svg";

type Currency = "USD" | "EUR" | "JPY";

interface Option {
  id: number;
  value: Currency;
  label: string;
  icon: string;
}

const options: Option[] = [
  {id: 1, value: "USD", label: "USD", icon: "$"},
  {id: 2, value: "EUR", label: "EUR", icon: "€"},
  {id: 3, value: "JPY", label: "JPY", icon: "¥"},
];

const CurrencySelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="currency-select-wrapper">
      <button onClick={() => setIsOpen(!isOpen)} className="currency-select">
        <span className="currensy-text">{selectedOption?.icon}</span>
        {isOpen ? (
          <img src={ArrowU} alt="Up Arrow" className="arrow-icon"/>
        ) : (
          <img src={ArrowD} alt="Down Arrow" className="arrow-icon"/>
        )}
      </button>

      <ul className="currency-dropdown">
        {isOpen &&
          options.map((option) => (
            <li
              className="currency-dropdown-item"
              key={option.id}
              value={option.value}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              <span className="currensy-text">{option.icon}</span>
              <span className="currensy-text">{option.value}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CurrencySelect;
