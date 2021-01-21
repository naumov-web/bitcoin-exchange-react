import format from "format-number";

const TableCellValue = ({ value }) => {
  if (isNaN(value)) {
    return value;
  }

  return format({ round: 8 })(value * 1);
};

export default TableCellValue;
