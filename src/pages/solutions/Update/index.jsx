import React, { useContext, useState, useEffect } from "react";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import axios from "axios";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function UpdateSolution() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();
  const { user } = useContext(AuthGoogleContext);
  let role = user.localData.role
  const [solutionData, setSolutionData] = useState([]);
  const [result, setResult] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  let getData = async () => {
    await axios
      .get(import.meta.env.VITE_SERVER + "/solution/" + id)
      .then(async (solutionRes) => {
        if (!solutionRes.data.results) return;
        setSolutionData(solutionRes.data.results);
        setValue("title", solutionRes.data.results.title)
        setValue("details", solutionRes.data.results.details)
        setValue("devContact", solutionRes.data.results.dev_contact)
      });
  };

  useEffect(() => {
    getData();
  },[]);
  
  const patchData = async (data) => {
    await axios
      .patch(import.meta.env.VITE_SERVER + "/solution/" + id, data)
      .then(function (res) {
        navigate("/solutions/" + id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onSubmit = (e) => {
    setResult(
      "PATCH:\n" +
        JSON.stringify(e, null, 2) +
        "\n(redirecionar para página Listar Problemas qnd o backend confirmar)"
    );
    patchData(e);
  };

  if (role!=="d" && role!=="g") return (
    <p className="text-danger pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 ">
      Apenas um Desenvolvedor ou o Gestor tem permissão para cadastrar, modificar ou excluir uma Solução de Causa-Raiz
    </p>
  )
  else return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Modificar Solução de Causa-Raiz</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="row d-flex justify-content-center"
      >
        <div className="col-md-12">
          <label htmlFor="title" className="mb-0 col-form-label">
            Título da solução:
          </label>
          <input
            id="title"
            type="text"
            className="mb-3 form-control"
            {...register("title", {
              required: "Campo obrigatório",
              minLength: {
                value: 3,
                message: "Mínimo de 3 caracteres"
              }
            })}
          />
          <p className="text-warning">{errors?.title?.message}</p>
        </div>
        <div className="col-md-6">
          <label htmlFor="description" className="mb-0 col-form-label">
            Detalhes da solução:
          </label>
          <textarea
            rows={5}
            id="description"
            className="mb-3 form-control"
            {...register("details", { required: "Campo obrigatório" })}
          />
          <p className="text-warning">{errors?.desc?.message}</p>
        </div>
        <div className="col-md-6">
          <label htmlFor="developer-contact" className="mb-0 col-form-label">
            Contato do(s) desenvolvedor(es) responsável(is):
          </label>
          <textarea
            rows={5}
            id="developer-contact"
            className="mb-3 form-control"
            {...register("devContact", { required: "Campo obrigatório" })}
          />
          <p className="text-warning">{errors?.devContact?.message}</p>
        </div>
        <div className="my-4 col-12 d-flex justify-content-center">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#confirm"
            className="mx-3 px-5 btn btn-primary"
          >
            Enviar
          </button>
        </div>
        <pre style={{ visibility: "hidden" }}>{result}</pre>
        <Modal id="confirm" body="Deseja modificar a Solução de Causa-Raiz?" submit />
      </form>
    </>
  );
}
