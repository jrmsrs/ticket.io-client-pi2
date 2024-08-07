import React, { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import axios from "axios";
import Modal from "../../../components/Modal";
import DatePicker, { CalendarContainer } from "react-datepicker";
import Select from "react-select";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, Link } from "react-router-dom";

/* documentação react-datepicker: https://reactdatepicker.com/ */
/* documentação react-hook-form: https://react-hook-form.com/get-started/ */

function NewIssue() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectDate, setSelectDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [issuesData, setIssuesData] = useState([]);
  const [issuesOptions, setIssuesOptions] = useState([]);
  const [issueSelect, setIssueSelect] = useState(null);
  const [groupsData, setGroupsData] = useState([]);
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [groupSelect, setGroupSelect] = useState(null);
  const [emptySelect, setEmptySelect] = useState(true);
  const [reincident, setReincident] = useState(false);
  const [result, setResult] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthGoogleContext);
  let role = user.localData.role;
  //let options = []
  let getGroupsData = async () => {
    let resGroups = await axios.get(import.meta.env.VITE_SERVER + "/group");
    setGroupsData(resGroups.data.results);
    let resIssues = await axios.get(import.meta.env.VITE_SERVER + "/issue");
    setIssuesData(resIssues.data.results);
  };

  const generateLero = async () => {
    await axios.get(import.meta.env.VITE_SERVER + "/lero").then((res) => {
      setValue("title", res.data.issueTitleLero),
        setValue("desc", res.data.issueDescLero);
    });
  };

  useEffect(() => {
    if (groupsData.length <= 0) {
      getGroupsData();
    } else {
      setGroupsOptions([]);
      groupsData.map((op) => {
        var item = {
          value: op.id,
          label: op.name,
        };
        return setGroupsOptions((options) => [...options, item]);
      });
      issuesData.map((op) => {
        var item = {
          value: op.id,
          label:
            `[TP${op.id.slice(0, 9)}...]` +
            (op.root_cause ? ` (FINALIZADO) ` : ` (EM ANDAMENTO) `) +
            `${op.title}`,
        };
        return setIssuesOptions((options) => [...options, item]);
      });
    }
  }, [groupsData, issuesData]);

  const calendarContainer = ({ className, children }) => {
    return (
      <div
        style={{
          width: "100vw",
          padding: "3px",
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  const handleGroupSelect = async (e) => {
    setGroupSelect(e);
    setEmptySelect(false);
    await axios
      .get(import.meta.env.VITE_SERVER + "/group/" + e.value + "?members=true")
      .then((resMembers) => {
        let str = "";
        resMembers.data.results.map((member) => {
          str += member.user.name + "\ne-mail: ";
          str += member.user.email + ";\n\n";
        });
        setValue("dev_contact", str);
      });
  };

  const handleIssueSelect = async (e) => {
    setIssueSelect(e);
  };

  const postData = async (data) => {
    delete data.dev_contact;
    await axios
      .post(import.meta.env.VITE_SERVER + "/issue", data)
      .then(function (res) {
        navigate("/issues/" + res.data.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const patchReincidentData = async (data) => {
    const issue_id = data.issue;
    delete data.dev_contact;
    delete data.issue;
    await axios
      .patch(
        import.meta.env.VITE_SERVER + "/issue/" + issue_id + "?reincident=true",
        data
      )
      .then(function (res) {
        navigate("/issues/" + issue_id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onSubmit = (e) => {
    e.group_id = groupSelect.value;
    e.prev_conclusion = selectDate;
    e.author = user.localData.id;
    setResult(
      "POST:\n" +
        JSON.stringify(e, null, 2) +
        "\n(redirecionar para página Listar Problemas qnd o backend confirmar)"
    );
    postData(e);
  };

  const onReincidentSubmit = (e) => {
    e.issue = issueSelect.value;
    setResult(
      "PATCH:\n" +
        JSON.stringify(e, null, 2) +
        "\n(redirecionar para página do Problema qnd o backend confirmar)"
    );
    patchReincidentData(e);
  };

  if (role !== "q" && role !== "g")
    return (
      <p className="text-danger pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 ">
        Apenas um Analista de Qualidade ou o Gestor tem permissão para
        cadastrar, modificar ou excluir um Problema
      </p>
    );
  else
    return (
      <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
          <h1 className="h2">
            {!reincident
              ? "Cadastrar Ticket de Problema"
              : "Cadastrar Reincidente"}
          </h1>
        </div>
        <p className="form-check">
          <input
            type="checkbox"
            name="reincident"
            id="reincident"
            checked={reincident}
            onChange={() => setReincident(!reincident)}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="reincident">
            Problema reincidente?
          </label>
        </p>
        {!reincident ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="row d-flex justify-content-center"
          >
            <div className="col-md-6">
              <label htmlFor="title" className="mb-0 col-form-label">
                Título do problema:{" "}
              </label>
              <input
                id="title"
                type="text"
                className="mb-3 form-control"
                {...register("title", {
                  required: "Campo obrigatório",
                  minLength: {
                    value: 3,
                    message: "Mínimo de 3 caracteres",
                  },
                })}
              />
              <p className="text-warning">{errors?.title?.message}</p>
            </div>
            <div className="col-md-6">
              <label
                htmlFor="react-select-2-input"
                className="mb-0 col-form-label"
              >
                Grupo atribuído:{" "}
              </label>
              <Select
                value={groupSelect}
                onChange={(e) => {
                  handleGroupSelect(e);
                }}
                defaultValue={[]}
                name="group"
                isLoading={groupsData.length <= 0}
                options={groupsOptions}
                placeholder={
                  groupsData.length <= 0 ? "Carregando..." : "Selecionar"
                }
                className="form-text basic-multi-select text-dark mb-3"
                classNamePrefix="select"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="description" className="mb-0 col-form-label">
                Descrição do problema:{" "}
              </label>
              <textarea
                rows={5}
                id="description"
                className="mb-3 form-control"
                {...register("desc", { required: "Campo obrigatório" })}
              />
              <p className="text-warning">{errors?.desc?.message}</p>
            </div>
            <div className="col-md-6">
              <label
                htmlFor="developer-contact"
                className="mb-0 col-form-label"
              >
                Contato do desenvolvedor:{" "}
              </label>
              <textarea
                rows={5}
                id="developer-contact"
                className="mb-3 form-control"
                {...register("dev_contact", { required: "Campo obrigatório" })}
              />
              <p className="text-warning">{errors?.dev_contact?.message}</p>
            </div>
            <div className="col-6">
              <label htmlFor="date" className="mb-0 col-form-label">
                Previsão de conclusão:{" "}
              </label>
              <DatePicker
                id="date"
                calendarContainer={calendarContainer}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                selected={selectDate}
                onChange={(date) => setSelectDate(date)}
              />
            </div>
            <div className="col-6">
              <label htmlFor="incidentsCount" className="mb-0 col-form-label">
                Número de incidentes:
              </label>
              <input
                type="number"
                name="incidentsCount"
                id="incidentsCount"
                min={1}
                defaultValue={1}
                className="mb-3 form-control"
                {...register("incidents_count", {
                  required: "Campo obrigatório",
                  min: { value: 1, message: "Valor inválido" },
                })}
              />
              <p className="text-warning">{errors?.incidents_count?.message}</p>
            </div>
            <div className="my-4 col-12 d-flex justify-content-center">
              <button
                type="reset"
                className="mx-2 px-5 btn btn-warning"
                onClick={() => setGroupSelect(null)}
              >
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
            <Link onClick={generateLero} className="link text-center">
              Gerador de Lero Lero
            </Link>
            <pre style={{ visibility: "hidden" }}>{result}</pre>
            <Modal
              id="confirm"
              body="Deseja cadastrar o Ticket de Problema?"
              submit
            />
          </form>
        ) : (
          <form
            onSubmit={handleSubmit(onReincidentSubmit)}
            className="row d-flex justify-content-center"
          >
            <div className="col-8 col-md-9 col-lg-10">
              <label
                htmlFor="react-select-2-input"
                className="mb-0 col-form-label"
              >
                Problema associado:
              </label>
              <Select
                value={issueSelect}
                onChange={(e) => {
                  handleIssueSelect(e);
                }}
                defaultValue={[]}
                name="issue"
                isLoading={issuesData.length <= 0}
                options={issuesOptions}
                placeholder={
                  groupsData.length <= 0 ? "Carregando..." : "Selecionar"
                }
                className="form-text basic-multi-select text-dark mb-3"
                classNamePrefix="select"
              />
            </div>
            <div className="col-4 col-md-3 col-lg-2">
              <label htmlFor="incidentsCount" className="mb-0 col-form-label">
                Reincidentes:
              </label>
              <input
                type="number"
                name="incidentsCount"
                id="incidentsCount"
                min={1}
                defaultValue={1}
                className="mb-3 mt-1 form-control"
                {...register("incidents_count", {
                  required: "Campo obrigatório",
                  min: { value: 1, message: "Valor inválido" },
                })}
              />
              <p className="text-warning">{errors?.incidents_count?.message}</p>
            </div>
            <div className="col-12">
              <a
                className="d-flex flex-column btn btn-primary"
                href={null}
                data-bs-toggle="modal"
                data-bs-target="#confirm"
              >
                Cadastrar Reincidência / Reabrir Problema
              </a>
            </div>

            <Modal
              id="confirm"
              body="Deseja cadastrar reincidência nesse problema? Caso o problema esteja finalizado será reaberto."
              submit
            />
          </form>
        )}
      </>
    );
}

export default NewIssue;
