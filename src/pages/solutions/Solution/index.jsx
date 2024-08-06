import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";
import { DoneOutlineTwoTone } from "@mui/icons-material";

export default function Solution() {
  const { id } = useParams();
  const [solutionData, setSolutionData] = useState([]);
  const [solutionIssues, setSolutionIssues] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthGoogleContext);
  let role = user.localData.role

  let getData = async () => {
    await axios
      .get(import.meta.env.VITE_SERVER + "/solution/" + id)
      .then(async (solutionRes) => {
        if (!solutionRes.data.results) return;
        setSolutionData(solutionRes.data.results);
        setSolutionIssues(solutionRes.data.issues)
      });
  };

  let removeData = async () => {
    await axios
      .delete(import.meta.env.VITE_SERVER + "/solution/" + id)
      .then(function () {
        navigate("/solutions");
      });
  };

  useEffect(() => {
    getData();
  },[]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Detalhes da Solução de Causas-Raiz</h1>
      </div>
      <h3>Solução:</h3>
      <p style={{ marginBottom: "0" }}>
        <strong>{solutionData.title}</strong> [CR{id.slice(0,9)}...]
      </p>
      <h3 className="mt-3">Detalhes:</h3>
      <pre style={{whiteSpace: "pre-line"}}>{solutionData.details}</pre>
      <h3>Data de criação:</h3>
      <p>{new Date(solutionData.created_at).toLocaleString()}</p>
      <h3>Problemas associados:</h3>
      <p>
        {solutionIssues.map((solId)=><span key={solId}><Link to={`/issues/${solId}`}>{`[TP${solId.slice(0,9)}...]`}</Link> </span>)}
        {solutionIssues.length<=0 && <>Nenhum</>}
      </p>
      {(role==="d" || role==="g") &&
        <>
          <div className="d-flex flex-column">
            <Link
              to={"/solutions/" + solutionData.id + "/update"}
              className="m-2 btn btn-primary"
            >
              Modificar Solução de Causa-Raiz
            </Link>
            <Link
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#confirm"
              className="m-2 btn btn-danger"
            >
              Excluir Solução de Causa-Raiz
            </Link>
          </div>
          <Modal
            id="confirm"
            danger
            body={
              <>
                <p>Deseja excluir essa Solução de Causa-Raiz? Todos os problemas associados a ela serão marcados como "Em aberto".</p>
              </>
            }
            onClick={removeData}
            confirm="Excluir"
          />
        </>
      }
    </>
  );
}
