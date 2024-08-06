import Select from "react-select";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

/* documentação react-select: https://react-select.com/ */
/* documentação react-hook-form: https://react-hook-form.com/get-started/ */

function NewGroup() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [select, setSelect] = useState(null);
  const [emptySelect, setEmptySelect] = useState(true);
  const [result, setResult] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthGoogleContext);
  let role = user.localData.role
  let getData = async () => {
    let res = await axios.get(import.meta.env.VITE_SERVER + "/user");
    setData(res.data.results);
  };
  let postData = async (data) => {
    await axios
      .post(import.meta.env.VITE_SERVER + "/group", data)
      .then(function (res) {
        navigate("/groups/" + res.data.id);
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
    setSelect(e);
    setEmptySelect(e.length <= 0);
  };

  const onSubmit = (e) => {
    const selectArr = [];
    select.map((i) => selectArr.push(i.value));
    e.users = selectArr;
    postData(e);
  };

  if (role!=="g") return (
    <p className="text-danger pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 ">
      Apenas o Gestor tem permissão para cadastrar, modificar ou excluir um Grupo Solucionador
    </p>
  )
  else return (
    <>
      <div className="justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Cadastrar Grupo Solucionador</h1>
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
          value={select}
          onChange={(e) => {
            handleSelect(e);
          }}
          defaultValue={[]}
          name="users"
          isLoading={data.length <= 0}
          options={options}
          placeholder={data.length <= 0 ? "Carregando..." : "Selecionar"}
          className="form-text basic-multi-select text-dark"
          classNamePrefix="select"
        />
        <div className="my-4 col-12 d-flex justify-content-center">
          <button type="reset" className="mx-2 px-5 btn btn-warning" onClick={()=>setSelect(null)}>
            Limpar
          </button>
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
        <Modal id="confirm" body="Deseja cadastrar o Grupo Solucionador?" submit />
      </form>
    </>
  );
}

export default NewGroup;
