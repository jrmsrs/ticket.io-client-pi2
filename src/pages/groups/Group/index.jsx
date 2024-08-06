import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";

function Group() {
  const { id } = useParams();
  const [groupData, setGroupData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupIssues, setGroupIssues] = useState([]);
  const { user } = useContext(AuthGoogleContext);
  let role = user.localData.role
  const navigate = useNavigate();

  let getData = async () => {
    let groupRes = await axios.get(
      import.meta.env.VITE_SERVER + "/group/" + id
    );
    setGroupData(groupRes.data.results);
    let groupMembersRes = await axios.get(
      import.meta.env.VITE_SERVER + "/group/" + id + "?members=true"
    );
    setGroupMembers(groupMembersRes.data.results);
    let groupIssuesRes = await axios.get(
      import.meta.env.VITE_SERVER + "/group/" + id + "?issues=true"
    );
    setGroupIssues(groupIssuesRes.data.results);
  };

  let removeData = async () => {
    await axios
      .delete(import.meta.env.VITE_SERVER + "/group/" + id)
      .then(function () {
        navigate("/groups");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Detalhes do Grupo Solucionador</h1>
      </div>
      <h3>Nome do grupo:</h3>
      <p>{groupData.name}</p>
      <h3>Data de criação:</h3>
      <p>{new Date(groupData.created_at).toLocaleString("pt-BR")}</p>
      <h3>Membros:</h3>
      <div>
        {groupMembers.map((member) => (
          <p key={member.id}>
            {member.name} ({member.email})
          </p>
        ))}
      </div>
      <h3>Problemas associados:</h3>
      <div className="mb-4">
        {groupIssues.map((issId) => (
          <span key={issId}><Link to={`/issues/${issId}`}>{`[TP${issId.slice(0,9)}...]`}</Link> </span>
        ))}
      </div>

      {(role==="g") && 
        <>
          <div className="d-flex flex-column">
            <Link
              to={"/groups/" + groupData.id + "/update"}
              className="m-2 btn btn-primary"
            >
              Modificar Grupo Solucionador
            </Link>
            <Link
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#confirm"
              className="m-2 btn btn-danger"
            >
              Excluir Grupo Solucionador
            </Link>
          </div>
          <Modal
            id="confirm"
            danger
            body="Deseja excluir o Grupo Solucionador?"
            onClick={removeData}
          />
        </>
      }
    </>
  );
}

export default Group;
