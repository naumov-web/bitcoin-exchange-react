import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@material-ui/core";

import apisConfig from "../../../config/apis";
import paginationConfig from "../../../config/pagination";

const buildShowingRows = (originRows, limit, sortBy, sortDirection) => {
  if (typeof originRows[0] === "undefined") {
    return [];
  }

  var result = originRows.slice();

  if (limit) {
    result = result.slice(0, limit);
  }

  return result;
};

const IndexPage = () => {
  // State definitions
  const [rows, setRows] = useState([]);
  const [limit, setLimit] = useState(paginationConfig.defaultShowingItemsCount);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const columns = [
    {
      field: "symbol",
      headerName: "Ticker"
    },
    {
      field: "bid",
      headerName: "Bid"
    },
    {
      field: "ask",
      headerName: "Ask"
    },
    {
      field: "high",
      headerName: "High"
    },
    {
      field: "low",
      headerName: "Low"
    },
    {
      field: "last",
      headerName: "Last"
    }
  ];

  useEffect(() => {
    const promise = async () =>
      await fetch(apisConfig.restBaseUrl + apisConfig.endpoints.getTickers, {
        mode: "no-cors",
        headers: {
          Accept: "application/json"
        }
      }).then(res => res.json());

    promise().then(data => setRows(data));
  }, []);

  const showingRows = buildShowingRows(rows, limit, sortBy, sortDirection);

  return (
    <div className="index-page">
      {limit && (
        <div className="show-all-button-row">
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setLimit(null)}
          >
            Показать все
          </Button>
        </div>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={`column-${column.field}`}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {showingRows && (
            <>
              {showingRows.map(row => (
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={`column-${column.field}`}>
                      {row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default IndexPage;
