import Select, { components } from "react-select";
import "./style.css";

// css for select options
const customStyles = {
  // Custom styles for individual options
  option: (provided, state) => ({
    ...provided,
    color: "#000", // Text color
    backgroundColor: state.isFocused ? "#ddd" : "white", // Background color when focused
    backgroundColor: state.isSelected ? "#0089e5" : "white", // Background color when selected
    color: state.isSelected ? "white" : "#000", // Text color when selected
    ":hover": {
      backgroundColor: "#e08804", // Background color on hover
    },
  }),
  // Custom styles for the menu list
  menuList: (provided, state) => ({
    ...provided,
    "&::-webkit-scrollbar": {
      width: "6px", // Width of the scrollbar
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#8e8e8e", // Color of the scrollbar thumb
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f1f1f1", // Color of the scrollbar track
    },
    scrollbarWidth: "thin", // Width of the scrollbar
  }),
  // Custom styles for multi-value label
  multiValueLabel: (provided) => ({
    ...provided,
    whiteSpace: "nowrap", // Prevent the label from wrapping to the next line
    overflow: "hidden", // Hide overflow content
    textOverflow: "ellipsis", // Display ellipsis for overflow content
    height: "38px", // Set height for consistency
  }),
};

const CustomSelect = ({
  options,            // Array of options for the select
  selectedOption,     // Selected option(s)
  onChange,           // onChange event handler
  isSearchable,       // Whether the select is searchable
  isDisabled,         // Whether the select is disabled
  placeholder,        // Placeholder text
  isMulti,            // Whether multiple options can be selected
}) => {
  // Handle change event for the select
  const handleChange = (selected) => {
    onChange(selected);
  };

  // Function to create checkbox options for custom select box
  const CheckboxOption = (props) =>
    isMulti ? (
      // Render checkbox for multi-select
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => {}}
          className="mr-2"
        />
        {props.label}
      </components.Option>
    ) : (
      // Render normal option for single-select
      <div>
        <components.Option {...props}>{props.label}</components.Option>
      </div>
    );

  // Render the custom select component
  return (
    <div className="customSelect">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isSearchable={isSearchable || false}
        isMulti={isMulti || false}
        isDisabled={isDisabled}
        placeholder={placeholder}
        components={{ Option: CheckboxOption }}
        styles={customStyles} // Apply the custom styles
        className="react-select-container basic-single"
        classNamePrefix="react-select"
        isClearable
        // menuIsOpen
      />
    </div>
  );
};

// Export the CustomSelect component as default
export default CustomSelect;
