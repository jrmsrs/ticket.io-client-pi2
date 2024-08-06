import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from "axios";
import "./styles.css";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

/* documentação axios: https://axios-http.com/ptbr/docs/intro */
/* documentação react-data-table-component: https://react-data-table-component.netlify.app/ */
/* https://www.npmjs.com/package/react-data-table-component-extensions */

export default function Issues() {
  const [filtered, setFiltered] = useState("no");
  const [data, setData] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [dataFilteredLate, setDataFilteredLate] = useState([]);
  const [dataFilteredFinished, setDataFilteredFinished] = useState([]);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();

  async function getData() {
    await axios.get(import.meta.env.VITE_SERVER + "/issue")
    .then((res) => {
      setData(res.data.results)
      const filterUnwanted = (arr) => {
        const required = arr.filter(el => {
          return !el.conclusion;
        });
        return required;
      };
      const filterUnwantedLate = (arr) => {
        const required = arr.filter(el => {
          return !el.conclusion && (new Date(el.prev_conclusion)-new Date()<0);
        });
        return required;
      };
      const filterUnwantedFinished = (arr) => {
        const required = arr.filter(el => {
          return el.conclusion;
        });
        return required;
      };
      setDataFiltered(filterUnwanted(res.data.results))
      setDataFilteredLate(filterUnwantedLate(res.data.results))
      setDataFilteredFinished(filterUnwantedFinished(res.data.results))
      setPending(false)
    })
    .catch((error) => console.error(error));
    
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      id: "incidents",
      name: "Incidentes",
      selector: (row) => row.incidents_count,
      sortable: true,
      width: "72px"
    },
    {
      id: "title",
      name: "Problema",
      selector: (row) => `[TP${row.id.slice(0,9)}...] ${row.title}`,
      sortable: true,
      width: "400px"
    },
    {
      id: "conclusion",
      name: "Conclusão",
      selector: (row) => new Date(row.conclusion).toISOString(),
      format: (row) => row.conclusion ? new Date(row.conclusion).toLocaleDateString("pt-BR") : "Em andamento",
      sortable: true,
      width: "180px"
    },
    {
      id: "prev_conclusion",
      name: "Previsão de conclusão",
      selector: (row) => new Date(row.prev_conclusion).toISOString(),
      format: (row) => new Date(row.prev_conclusion).toLocaleDateString("pt-BR"),
      sortable: true,
      width: "180px"
    },
    {
      id: "created_at",
      name: "Data de criação",
      selector: (row) => new Date(row.created_at).toISOString(),
      format: (row) => new Date(row.created_at).toLocaleString("pt-BR"),
      sortable: true,
      width: "200px"
    }
  ];

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Lista de Tickets de Problema</h1>
      </div>
      <div
        className={
          localStorage.getItem("dark") === "true"
            ? "table-responsive-dark"
            : "table-responsive-light"
        }
      >
        {(filtered==="no") &&
          <>
            <DataTableExtensions {...{ columns, data }}>
              <DataTable
                theme={localStorage.getItem("dark") === "true" ? "dark" : "light"}
                keyField={"email"}
                onRowClicked={(data) => {
                  return navigate("/issues/" + data.id);
                }}
                pointerOnHover
                pagination
                defaultSortFieldId={"incidents"}
                defaultSortAsc={false}
                highlightOnHover
                progressPending={pending}
                progressComponent={<CircularProgress
                  color="inherit"
                  style={{ margin: "3em 0" }}
                />}
              />
            </DataTableExtensions>
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("open")}>TPs em andamento</Link></p>
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("finished")}>TPs finalizados</Link></p>
            <p className="text-center"><Link className="link" onClick={()=>setFiltered("late")}>TPs atrasados</Link></p>
          </>
        }
        {(filtered==="open") &&
          <>
            <DataTable
              columns={columns} 
              data={dataFiltered}
              theme={localStorage.getItem("dark") === "true" ? "dark" : "light"}
              keyField={"email"}
              onRowClicked={(dataFiltered) => {
                return navigate("/issues/" + dataFiltered.id);
              }}
              pointerOnHover
              pagination
              defaultSortFieldId={"incidents"}
              defaultSortAsc={false}
              highlightOnHover
              progressPending={pending}
              progressComponent={<CircularProgress
                color="inherit"
                style={{ margin: "3em 0" }}
              />}
            />
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("late")}>TPs atrasados</Link></p>
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("finished")}>TPs finalizados</Link></p>
            <p className="text-center"><Link className="link" onClick={()=>setFiltered("no")}>Todos os TPs</Link></p>
          </>
        }
        {(filtered==="late") &&
          <>
            <DataTable
              columns={columns} 
              data={dataFilteredLate}
              theme={localStorage.getItem("dark") === "true" ? "dark" : "light"}
              keyField={"email"}
              onRowClicked={(dataFilteredLate) => {
                return navigate("/issues/" + dataFilteredLate.id);
              }}
              pointerOnHover
              pagination
              defaultSortFieldId={"incidents"}
              defaultSortAsc={false}
              highlightOnHover
              progressPending={pending}
              progressComponent={<CircularProgress
                color="inherit"
                style={{ margin: "3em 0" }}
              />}
            />
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("open")}>TPs em andamento</Link></p>
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("finished")}>TPs finalizados</Link></p>
            <p className="text-center"><Link className="link" onClick={()=>setFiltered("no")}>Todos os TPs</Link></p>
          </>
        }
        {(filtered==="finished") &&
          <>
            <DataTable
              columns={columns} 
              data={dataFilteredFinished}
              theme={localStorage.getItem("dark") === "true" ? "dark" : "light"}
              keyField={"email"}
              onRowClicked={(dataFilteredFinished) => {
                return navigate("/issues/" + dataFilteredFinished.id);
              }}
              pointerOnHover
              pagination
              defaultSortFieldId={"incidents"}
              defaultSortAsc={false}
              highlightOnHover
              progressPending={pending}
              progressComponent={<CircularProgress
                color="inherit"
                style={{ margin: "3em 0" }}
              />}
            />
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("open")}>TPs em andamento</Link></p>
            <p className="mt-3 text-center"><Link className="link" onClick={()=>setFiltered("late")}>TPs atrasados</Link></p>
            <p className="text-center"><Link className="link" onClick={()=>setFiltered("no")}>Todos os TPs</Link></p>
          </>
        }
      </div>
    </>
  );
}
