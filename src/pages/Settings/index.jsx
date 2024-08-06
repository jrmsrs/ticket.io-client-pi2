import { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../contexts/authGoogle";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal";
import axios from "axios";

function Settings() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const { user, signed, signOut } = useContext(AuthGoogleContext);
  let role = user.localData.role
  const [data, setData] = useState([]);
  const [dataOutput, setDataOutput] = useState({})
  const [reportSelectData, setReportSelectData] = useState({});
  const [reportOutput, setReportOutput] = useState({})

  useEffect(() => {
    getData();
  }, []);

  if (!signed || !user) return <Navigate to="/login" />;

  let getData = async () => {
    let res = await axios.get(
      import.meta.env.VITE_SERVER + "/user?email=" + user.email
    );
    setData(res.data.results);
  };

  let patchData = async (_data) => {
    await axios
      .patch(import.meta.env.VITE_SERVER + "/user/" + data.id, _data)
      .then(function (res) {
        setDataOutput({success: true, message: "Perfil alterado com sucesso"});
      });
  };

  const onProfileSubmit = (e) => {
    let o = Object.entries(e).reduce(
      (acc, [k, v]) => (v ? { ...acc, [k]: v } : acc),
      {}
    );
    if (o.name === user.displayName) delete o.name
    setDataOutput({})
    if (Object.keys(o).length === 0 && o.constructor === Object) return;
    patchData(o);
  };

  const patchReportCron = async (_data) => {
    if (_data.cron)
      await axios
        .patch(import.meta.env.VITE_SERVER + "/report", _data)
        .then(function (res) {
          setReportOutput({success: true, message: "Período de envio alterado com sucesso"})
        });
  };
  const handleReportPeriodChange = (e) => {
    e.preventDefault()
    setReportSelectData({cron: e.target.value})
  };

  let removeData = async () => {
    await axios
      .delete(import.meta.env.VITE_SERVER + "/user/" + data.id)
      .then(function () {
        signOut();
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Configurações</h1>
      </div>

      <form>
        
        <p className="mt-3 mb-2 text-center fs-3 text-uppercase user-select-none">
          Relatório Gerencial
        </p>
        
        { (role==="g") &&
          <div className="w-100 row d-flex flex-row mx-auto">
          <div className="col-12 col-sm-9 px-0">
            <label htmlFor="report" className="fs-6">
              Período do envio automático
            </label>
            <select name="report" id="report" className="form-select" onChange={handleReportPeriodChange} defaultValue="">
              <option value="" disabled hidden>Selecionar período</option>
              <option value="* * * * *">À cada minuto (teste)</option>
              <option value="0 0 * * 6">Semanal (todo sábado, às 00:00)</option>
              <option value="0 0 1 * *">Mensal (primeiro dia do mês, às 00:00)</option>
            </select>
          </div>
          <div className="col-12 col-sm-3 mt-auto px-0">
            <button type="button" onClick={()=>patchReportCron(reportSelectData)} className="w-100 col btn btn-primary px-0">
              Alterar
            </button>
          </div>
        </div>
        }
        <p className="text-center my-2">
          <Link
              to={null}
              onClick={async ()=>{
                await axios.get(import.meta.env.VITE_SERVER+'/report?email='+user.email)
                .then(async (res) => {
                  setReportOutput({success: true, message: "E-mail gerencial enviado"})
                })
                .catch((error)=>setReportOutput({success: false, message: "Ocorreu um erro no envio"}))
              }}
              className="link"
            >
              Enviar manualmente para o meu e-mail
          </Link>
        </p>
        <p className="text-center my-2">
          <Link
              to={null}
              onClick={async ()=>{
                await axios.get(import.meta.env.VITE_RTDB_ENDPOINT + '/email.json')
                .then(async (res) => {
                  const email = res.data
                  if (!email.find(i => i==user.email))
                    email.push(user.email)
                  else 
                    return setReportOutput({success: false, message: "E-mail já está cadastrado"})
                  await axios.patch(import.meta.env.VITE_RTDB_ENDPOINT + '/.json',{email: email})
                  .then(setReportOutput({success: true, message: "E-mail cadastrado"}))
                  .catch((error)=>setReportOutput({success: false, message: "Ocorreu um erro"}))
                })
                .catch((error)=>setReportOutput({success: false, message: "Ocorreu um erro"}))
              }}
              className="link"
            >
              Cadastrar meu e-mail para receber automaticamente
          </Link>
        </p>
        <div role="alert" hidden={!reportOutput.message} className={"mb-4 text-center alert-dismissible alert alert-"+ (reportOutput.success?"success":"warning")}>
          <div>{reportOutput.message}</div>
          <button type="button" className="btn-close" onClick={()=>setReportOutput({})}></button>
        </div>
      </form>

      <form onSubmit={handleSubmit(onProfileSubmit)}>
        <p className="mt-3 mb-2 text-center fs-3 text-uppercase user-select-none">
          Alterar Cadastro
        </p>
        <label htmlFor="name" className="fs-6">
          Nome completo
        </label>
        <input
          type="text"
          readOnly={user.displayName}
          name="name"
          id="name"
          className={
            "form-control mb-3" +
            (user.displayName ? " bg-dark text-light" : "")
          }
          defaultValue={user.displayName || data.name}
          {...register("name", {
            required: "Campo obrigatório",
            minLength: {
              value: 8,
              message: "Pelo menos 8 caracteres"
            },
            maxLength: {
              value: 40,
              message: "No máximo 40 caracteres, se possível abrevie"
            }
          })}
        />
        <p className="text-warning">{errors?.name?.message}</p>
        <label htmlFor="email" className="fs-6">
          E-mail
        </label>
        <input
          type="email"
          readOnly
          name="email"
          id="email"
          className="form-control bg-dark text-light mb-3"
          value={user.email}
        />
        <label htmlFor="cpf" className="fs-6">
          CPF
        </label>
        <input
          type="number"
          name="cpf"
          id="cpf"
          className="form-control mb-3"
          defaultValue={data.cpf}
          {...register("cpf", {
            minLength: {
              value: 11,
              message: "11 digitos!"
            },
            maxLength: {
              value: 11,
              message: "11 digitos!"
            },
            pattern: {
              value: /^[0-9]+$/i,
              message: "Apenas caracteres numéricos"
            }
          })}
        />
        <p className="text-warning">{errors?.cpf?.message}</p>
        <label htmlFor="email" className="fs-6">
          Cargo
        </label>
        <input
          type="role"
          readOnly
          name="role"
          id="role"
          className="form-control bg-dark text-light mb-3"
          value={(role==="g" ? "Gestor" : (role==="q" ? "Analista de Qualidade" : (role==="d" ? "Desenvolvedor" : "----")))}
        />

        <div className="w-100 d-flex flex-column">
          <button type="button" onClick={handleSubmit(onProfileSubmit)} className="w-50 mx-auto my-3 btn btn-primary">
            Confirmar Alterações
          </button>
          <p className={"my-2 text-center text-"+ (dataOutput.success?"success":"warning")}>{dataOutput.message}</p>
          <Link
            to={null}
            data-bs-toggle="modal"
            data-bs-target="#confirm"
            className="link-danger m-auto"
          >
            Excluir cadastro (irreversível)
          </Link>
        </div>
        <Modal
          id="confirm"
          title="Excluir cadastro"
          body={
            <>
              {"Tem certeza que deseja excluir o seu cadastro?"}
              <br />
              {"Irá remover seu nome de todos os grupos associados. "}
            </>
          }
          danger
          onClick={removeData}
        />
      </form>
    </>
  );
}

export default Settings;
