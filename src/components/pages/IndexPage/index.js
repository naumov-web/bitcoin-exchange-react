import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import { useQuery } from "react-query";

import apisConfig from "../../../config/apis";
import paginationConfig from "../../../config/pagination";

const buildShowingRows = (originRows, limit, sortBy, sortDirection) => {};

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
      }).then(res => setRows(res.json()));
  }, []);

  return (
    <div className="index-page">
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
          {rows && (
            <>
              {rows.map(row => (
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
