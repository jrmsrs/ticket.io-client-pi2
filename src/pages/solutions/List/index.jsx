import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from "axios";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

/* documentação axios: https://axios-http.com/ptbr/docs/intro */
/* documentação react-data-table-component: https://react-data-table-component.netlify.app/ */
/* https://www.npmjs.com/package/react-data-table-component-extensions */

export default function Solutions() {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();

  async function getData() {
    await axios.get(import.meta.env.VITE_SERVER + "/solution")
    .then((res) => {
      setData(res.data.results)
      setPending(false)
    })
    .catch((error) => console.error(error));
    
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      id: "title",
      name: "Solução",
      selector: (row) => `[CR${row.id.slice(0,9)}...] ${row.title.slice(0,65)}`+(row.title.length>65?"...":""),
      sortable: true
    },
    {
      id: "created_at",
      name: "Data de criação",
      selector: (row) => new Date(row.created_at).toISOString(),
      format: (row) => new Date(row.created_at).toLocaleString("pt-BR"),
      sortable: true,
      width: "180px"
    }
  ];

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Lista de Soluções de Causa-Raiz</h1>
      </div>
      <div
        className={
          localStorage.getItem("dark") === "true"
            ? "table-responsive-dark"
            : "table-responsive-light"
        }
      >
        <DataTableExtensions {...{ columns, data }}>
          <DataTable
            columns={columns}
            data={data}
            theme={localStorage.getItem("dark") === "true" ? "dark" : "light"}
            keyField={"email"}
            onRowClicked={(data) => {
              return navigate("/solutions/" + data.id);
            }}
            pointerOnHover
            pagination
            defaultSortFieldId={1}
            highlightOnHover
            progressPending={pending}
            progressComponent={<CircularProgress
              color="inherit"
              style={{ margin: "3em 0" }}
            />}
          />
        </DataTableExtensions>
      </div>
    </>
  );
}
