import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@material-ui/core";
import openSocket from "socket.io-client";
import classnames from "classnames";

// Components
import TableCellSort from "../../TableCellSort";
import TableCellValue from "../../TableCellValue";

// Configs
import apisConfig from "../../../config/apis";
import paginationConfig from "../../../config/pagination";

const buildShowingRows = (originRows, limit, sortBy, sortDirection) => {
  if (typeof originRows[0] === "undefined") {
    return [];
  }

  var result = originRows.slice();

  if (sortBy && sortDirection) {
    const directionIndex = sortDirection === "asc" ? 1 : -1;
    result.sort((a, b) =>
      a[sortBy] > b[sortBy] ? directionIndex : -directionIndex
    );
  }

  if (limit) {
    result = result.slice(0, limit);
  }

  return result;
};

const IndexPage = () => {
  // State definitions
  const [tableState, setTableState] = useState({
    rows: [],
    lastChangedSymbol: null
  });
  const [limit, setLimit] = useState(paginationConfig.defaultShowingItemsCount);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  var socket = null;
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

  const insertToRows = new_value => {
    const new_rows = tableState.rows.slice();

    for (var i = 0, len = new_rows.length; i < len; i++) {
      if (new_rows[i]["symbol"] === new_value["symbol"]) {
        new_rows[i] = new_value;
        setTableState({
          rows: new_rows,
          lastChangedSymbol: new_value["symbol"]
        });

        return;
      }
    }
  };

  useEffect(() => {
    const promise = async () =>
      await fetch(apisConfig.restBaseUrl + apisConfig.endpoints.getTickers, {
        mode: "no-cors",
        headers: {
          Accept: "application/json"
        }
      }).then(res => res.json());

    promise().then(data => {
      setTableState({
        rows: data,
        lastChangedSymbol: null
      });

      const initSocketPromise = async () =>
        await fetch(apisConfig.initSocketBaseUrl + "/init", {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

      initSocketPromise().then(data => {
        socket = openSocket(apisConfig.socketUrl);
        socket.on("ticker", data => {
          insertToRows(data);
        });
      });
    });
  }, []);

  const showingRows = buildShowingRows(
    tableState.rows,
    limit,
    sortBy,
    sortDirection
  );

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
                <TableCellSort
                  {...column}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onClick={() => {
                    setSortBy(column.field);
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {showingRows && (
            <>
              {showingRows.map(row => (
                <TableRow
                  className={classnames({
                    "last-updated-row":
                      row["symbol"] === tableState.lastChangedSymbol
                  })}
                  key={`table-row-${row["symbol"]}`}
                >
                  {columns.map(column => (
                    <TableCell key={`column-${column.field}`}>
                      <TableCellValue value={row[column.field]} />
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
