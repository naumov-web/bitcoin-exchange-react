import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import "./styles.sass";

const TableCellSort = ({
  field,
  headerName,
  sortBy,
  sortDirection,
  onClick
}) => {
  return (
    <div className="table-cell-sort" onClick={onClick}>
      <div>{headerName}</div>
      <div>
        {field === sortBy && sortDirection === "asc" && <KeyboardArrowUpIcon />}
        {field === sortBy && sortDirection === "desc" && (
          <KeyboardArrowDownIcon />
        )}
      </div>
    </div>
  );
};

export default TableCellSort;
