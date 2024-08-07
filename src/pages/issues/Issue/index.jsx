import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";
import { DoneOutlineTwoTone } from "@mui/icons-material";

export default function Issue() {
  const { id } = useParams();
  const [tpData, setTpData] = useState([]);
  const [tpGroupName, setTpGroupName] = useState([]);
  const [following, setFollowing] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthGoogleContext);
  let role = user.localData.role;

  let getData = async () => {
    await axios
      .get(import.meta.env.VITE_SERVER + "/issue/" + id)
      .then(async (tpRes) => {
        if (!tpRes.data.results) return;
        setTpData(tpRes.data.results);
        await axios
          .get(
            import.meta.env.VITE_SERVER +
              "/group/" +
              tpRes.data.results.group_id
          )
          .then((tpGroupRes) => {
            setTpGroupName(
              tpGroupRes.data.results ? tpGroupRes.data.results.name : null
            );
          });
      });
    await axios
      .get(
        `${import.meta.env.VITE_RTDB_ENDPOINT}/following/${
          user.localData.id
        }.json`
      )
      .then(async (res) => {
        let data = res.data;
        if (data.find((i) => i == id)) setFollowing(true);
        else setFollowing(false);
      });
  };

  let removeData = async () => {
    await axios
      .delete(import.meta.env.VITE_SERVER + "/issue/" + id)
      .then(function () {
        navigate("/issues");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Detalhes do Ticket de Problema</h1>
      </div>
      <h3>Ticket de Problema:</h3>
      <p style={{ marginBottom: "0" }}>
        <strong>{tpData.title}</strong> [TP{id.slice(0, 9)}...]
      </p>
      <pre style={{ whiteSpace: "pre-line" }}>{tpData.desc}</pre>
      <p>
        {tpData.incidents_count} incidente{tpData.incidents_count > 1 && <>s</>}
        <span> | </span>
        <Link
          to={null}
          onClick={async () => {
            return await axios
              .get(
                `${import.meta.env.VITE_RTDB_ENDPOINT}/following/${
                  user.localData.id
                }.json`
              )
              .then(async (res) => {
                let data = res.data;
                if (!data || !data.find((i) => i == id)) {
                  if (!data) data = [];
                  data.push(id);
                  console.log(data);
                  setFollowing(true);
                } else {
                  data = data.filter(function (e) {
                    return e !== id;
                  });
                  console.log(data);
                  setFollowing(false);
                }
                await axios
                  .put(
                    `${import.meta.env.VITE_RTDB_ENDPOINT}/following/${
                      user.localData.id
                    }.json`,
                    Object.assign({}, data)
                  )
                  .catch((error) => {
                    return console.log(error);
                  });
              });
          }}
        >
          {following ? "parar de acompanhar " : "acompanhar "}problema
        </Link>
      </p>
      <h3>Grupo atribuido:</h3>
      {tpGroupName && (
        <>
          <p style={{ marginBottom: "0" }}>
            <Link to={"/groups/" + tpData.group_id}>{tpGroupName}</Link>
          </p>
          <pre style={{ whiteSpace: "pre-line" }}>{tpData.dev_contact}</pre>
        </>
      )}
      {!tpGroupName && <p>Nenhum</p>}
      <h3>Previsão de Conclusão:</h3>
      <p
        className={
          !tpData.conclusion_at &&
          new Date(tpData.prev_conclusion) <= new Date()
            ? "text-danger"
            : ""
        }
      >
        {new Date(tpData.prev_conclusion).toLocaleDateString("pt-br", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        {!tpData.conclusion_at &&
          new Date(tpData.prev_conclusion) <= new Date() &&
          " (atrasado)"}
      </p>
      <h3>Conclusão:</h3>
      {tpData.conclusion_at && (
        <>
          <p>
            {new Date(tpData.conclusion_at).toLocaleDateString("pt-br", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={"http://drive.google.com/open?id=" + tpData.drive_doc_id}
            >
              Visualizar o Relatório
            </a>
            <span> | </span>
            <Link to={"/solutions/" + tpData.solution}>
              Causa-Raiz [CR{tpData.solution.slice(0, 9)}...]
            </Link>
          </p>
        </>
      )}

      {!tpData.conclusion_at && <p>Em andamento</p>}
      <h3>Data de criação:</h3>
      <p>{new Date(tpData.created_at).toLocaleString()}</p>

      {(role === "d" || role === "g") && (
        <>
          <Link
            to={"/issues/" + tpData.id + "/update?finish=true"}
            className={
              "d-flex flex-column m-2 btn btn-primary" +
              (tpData.conclusion_at ? " disabled" : "")
            }
          >
            <span>
              <DoneOutlineTwoTone /> Encerrar TP
            </span>
          </Link>
        </>
      )}
      {(role === "q" || role === "g") && (
        <>
          <div className="d-flex flex-column">
            <Link
              to={"/issues/" + tpData.id + "/update"}
              className={
                "m-2 btn btn-primary" +
                (tpData.conclusion_at ? " disabled" : "")
              }
            >
              Modificar Ticket de Problema
            </Link>
            <Link
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#confirm"
              className="m-2 btn btn-danger"
            >
              Excluir Ticket de Problema
            </Link>
            <Link to="/issues/new" className="m-2 text-center">
              Cadastrar Reincidente / Reabrir o Problema
            </Link>
          </div>
          <Modal
            id="confirm"
            danger
            body={
              <>
                <p>
                  <strong>Aviso:</strong> Isso EXCLUIRÁ o problema, para
                  encerrar use a opção "ENCERRAR PROBLEMA".
                </p>
                <p>
                  Ainda deseja prosseguir com a exclusão do Ticket de Problema?
                </p>
              </>
            }
            onClick={removeData}
            confirm="Excluir"
          />
        </>
      )}
    </>
  );
}
