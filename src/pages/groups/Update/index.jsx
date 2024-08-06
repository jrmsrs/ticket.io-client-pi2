import Select from "react-select";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";

/* documentação react-select: https://react-select.com/ */
/* documentação react-hook-form: https://react-hook-form.com/get-started/ */

function UpdateGroup() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [emptySelect, setEmptySelect] = useState(false);
  const [result, setResult] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthGoogleContext);
  let role = user.localData.role
  let getData = async () => {
    let promises = [];
    promises.push(axios.get(import.meta.env.VITE_SERVER + "/group/" + id));
    promises.push(
      axios.get(import.meta.env.VITE_SERVER + "/group/" + id + "?members=true")
    );
    promises.push(axios.get(import.meta.env.VITE_SERVER + "/user"));

    await Promise.all(promises).then((res) => {
      setValue("name", res[0].data.results.name)
      res[1].data.results.map(function (op) {
        setGroupMembers((groupMembers) => [
          ...groupMembers,
          { value: op.id, label: op.name + " {" + op.email + "}" }
        ]);
      });
      setData(res[2].data.results);
    });
  };
  let patchData = async (data) => {
    await axios
      .patch(import.meta.env.VITE_SERVER + "/group/" + id, data)
      .then(function (res) {
        navigate("/groups/" + id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (data.length <= 0) {
      getData();
    } else {
      data.map(function (op) {
        var item = {
          value: op.id,
          label: (op.name ? op.name : "sem nome") + " {" + op.email + "}"
        };
        if (op.role==="d")
          setOptions((options) => [...options, item]);
      });
    }
  }, [data]);

  const handleSelect = (e) => {
    setGroupMembers(e);
    setEmptySelect(e.length <= 0);
  };

  const onSubmit = (e) => {
    const selectArr = [];
    groupMembers.map((i) => selectArr.push(i.value));
    e.users = selectArr;
    patchData(e);
  };

  if (role!=="g") return (
    <p className="text-danger pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 ">
      Apenas o Gestor tem permissão para cadastrar, modificar ou excluir um Grupo Solucionador
    </p>
  )
  else return (
    <>
      <div className="justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Modificar Grupo Solucionador</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="mb-0 col-form-label">
          Nome do grupo:{" "}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="mb-3 form-control"
          {...register("name", {
            required: "Campo obrigatório",
            minLength: {
              value: 6,
              message: "Mínimo de 6 caracteres"
            },
            maxLength: {
              value: 255,
              message: "Estourou o máximo de caracteres, cê tá bem?"
            },
            
          })}
        />
        <p className="text-warning">{errors?.name?.message}</p>

        <label htmlFor="react-select-2-input" className="mb-0 col-form-label">
          Membros:{" "}
        </label>
        <Select
          isMulti
          value={groupMembers}
          onChange={(e) => {
            handleSelect(e);
          }}
          defaultValue={[groupMembers]}
          name="users"
          isLoading={data.length <= 0}
          options={options}
          placeholder={data.length <= 0 ? "Carregando..." : "Selecionar"}
          className="form-text basic-multi-select text-dark"
          classNamePrefix="select"
        />
        <div className="my-4 col-12 d-flex justify-content-center">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#confirm"
            className="mx-3 px-5 btn btn-primary"
            disabled={emptySelect}
          >
            Enviar
          </button>
        </div>
        <pre style={{ visibility: "hidden" }}>{result}</pre>
        <Modal id="confirm" body="Deseja modificar o Grupo Solucionador?" submit />
      </form>
    </>
  );
}

export default UpdateGroup;
