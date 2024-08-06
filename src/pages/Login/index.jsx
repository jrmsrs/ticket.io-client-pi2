import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, Link } from "react-router-dom";
import { AuthGoogleContext } from "../../contexts/authGoogle";
import axios from "axios";
import "./style.css";

function Login() {
  const {
    signInGoogle,
    signInPassword,
    createAcc,
    passwordReset,
    signed
  } = useContext(AuthGoogleContext);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [login, setLogin] = useState(true);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  async function onLoginSubmit(e) {
    await signInPassword(e.email, e.password)
    .catch((err) => {
      setMessage("Erro: " + err.message);
    });
  }

  async function onRegisterSubmit(e) {
    await createAcc(e.email, e.password)
    .then(() => {
      setLogin(true);
    })
    .catch((err) => {
      setMessage("Erro: " + err.message);
    });
  }

  async function onResetSubmit(e) {
    await passwordReset(e.email)
    .then(() => {
      setMessage("E-mail de redefinição de senha enviado");
    })
    .catch((err) => {
      setMessage("Erro: " + err.message);
    });
  }

  async function handleLoginFromGoogle() {
    await signInGoogle()
    .catch((err) => {
      setMessage("Erro: " + err.message);
    });
  }

  async function handleDemoLogin(user) {
    try {
      switch (user) {
        case "dev":
          await signInPassword(user+"@ticket.io", "senha123");
          break;
        case "qa":
          await signInPassword(user+"@ticket.io", "senha123")
          break;
        case "manager":
          await signInPassword(user+"@ticket.io", "senha123");
          break;
      }
    } catch (err) {
      setMessage("Erro interno ao tentar logar como "+user+"@ticket.io, tente novamente mais tarde");
    }
  }

  async function handleResetDb() {
    await axios.post(import.meta.env.VITE_SERVER + '/reset')
    .then((res) => {
      setMessage("Banco de dados restaurado com sucesso");
    })
    .catch((err) => {
      setMessage("Erro: Ocorreu um problema ao tentar restaurar banco de dados");
    });
  }


  useEffect(() => {
    setMessage("");
  }, [forgotPassword, login]);

  if (!signed) {
    return (
      <>
        <div className="login-container row d-flex align-items-center m-0">
          <div className="btn row d-flex align-items-center m-auto col-10 col-md-6 col-lg-5 col-xl-4 bg-primary text-light">
            {forgotPassword ? (
              // Tela de redefinir senha
              <form
                onSubmit={handleSubmit(onResetSubmit)}
                className="row d-flex align-items-center m-auto"
              >
                <p className="mt-3 mb-4 text-center fs-3 text-uppercase user-select-none">
                  Redefinir senha
                </p>
                <label htmlFor="email" className="fs-6">
                  E-mail cadastrado
                </label>
                <input
                  name="email"
                  placeholder="usuario@email.com"
                  id="email"
                  className="form-control mb-1"
                  {...register("email", {
                    required: "Campo vazio",
                    minLength: {
                      value: 8,
                      message: "E-mail inválido"
                    },
                    maxLength: {
                      value: 40,
                      message: "E-mail inválido"
                    },
                    pattern: {
                      value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "E-mail inválido"
                    }
                  })}
                />
                <p className="text-warning">{errors?.email?.message}</p>
                <button type="submit" className="mb-4 btn btn-outline-light">
                  Enviar redefinição de senha
                </button>
                <p role="alert" hidden={!message} className={"text-center alert-dismissible alert alert-"+((message.slice(0,3)==="Err") ? "warning":"success")}>
                  <span>{message}</span>
                  <button type="button" className="btn-close" onClick={()=>setMessage("")}></button>
                </p>
                <Link
                  to="#"
                  className="my-1 p-1 w-100 link-light text-center"
                  onClick={() => {
                    setForgotPassword(false);
                  }}
                >
                  Fazer login
                </Link>
              </form>
            ) : login ? (
              // Tela de login
              <form
                onSubmit={handleSubmit(onLoginSubmit)}
                className="row d-flex align-items-center m-auto"
              >
                <p className="mt-3 mb-4 text-center fs-3 text-uppercase user-select-none">
                  Entrar
                </p>
                <button
                  className="btn btn-outline-light d-inline-flex align-items-center justify-content-center"
                  onClick={handleLoginFromGoogle}
                  type="button"
                >
                  <img
                    className="mx-2"
                    alt="Google logo"
                    height="24"
                    width="24"
                    src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                  />
                  Autenticar-se com Google
                </button>
                <p className="mt-3 text-center user-select-none">ou</p>
                <label htmlFor="email" className="fs-6">
                  E-mail
                </label>
                <input
                  name="email"
                  placeholder="usuario@email.com"
                  id="email"
                  className="form-control mb-1"
                  {...register("email", {
                    required: "Campo vazio",
                    minLength: {
                      value: 3,
                      message: "Formato de e-mail inválido"
                    },
                    maxLength: {
                      value: 40,
                      message: "Formato de e-mail inválido"
                    },
                    pattern: {
                      value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Formato de e-mail inválido"
                    }
                  })}
                />
                <p className="text-warning">{errors?.email?.message}</p>
                <label htmlFor="password" className="fs-6">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••"
                  id="password"
                  className="form-control mb-1"
                  {...register("password", {
                    required: "Campo vazio",
                    minLength: {
                      value: 1,
                      message: "Campo vazio"
                    },
                    pattern: {
                      value: /^(.*?)/,
                      message: "Campo vazio"
                    }
                  })}
                />
                <p className="text-warning">{errors?.password?.message}</p>
                <button type="submit" className="mb-2 btn btn-outline-light">
                  Login
                </button>
                <p role="alert" hidden={!message} className={"text-center alert-dismissible alert alert-"+((message.slice(0,3)==="Err") ? "warning":"success")}>
                  <span>{message}</span>
                  <button type="button" className="btn-close" onClick={()=>setMessage("")}></button>
                </p>
                <Link
                  to="#"
                  className="my-1 p-1 w-100 link-light text-center"
                  onClick={() => {
                    setForgotPassword(true);
                  }}
                >
                  Esqueci a senha
                </Link>
                <Link
                  to="#"
                  className="my-1 p-1 w-100 link-light text-center"
                  onClick={() => {
                    setLogin(!login);
                  }}
                >
                  Cadastrar-se
                </Link>
              </form>
            ) : (
              // Tela de cadastro
              <form
                onSubmit={handleSubmit(onRegisterSubmit)}
                className="row d-flex align-items-center m-auto"
              >
                <p className="mt-3 mb-4 text-center fs-3 text-uppercase user-select-none">
                  CADASTRAR
                </p>
                <label htmlFor="email" className="fs-6">
                  E-mail
                </label>
                <input
                  name="email"
                  placeholder="usuario@email.com"
                  id="email"
                  className="form-control mb-1"
                  {...register("email", {
                    required: "Campo vazio",
                    minLength: {
                      value: 8,
                      message: "E-mail inválido"
                    },
                    maxLength: {
                      value: 40,
                      message: "E-mail inválido"
                    },
                    pattern: {
                      value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "E-mail inválido"
                    }
                  })}
                />
                <p className="text-warning">{errors?.email?.message}</p>
                <label htmlFor="password" className="fs-6">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="digite uma senha forte"
                  id="password"
                  className="form-control mb-1"
                  {...register("password", {
                    required: "Campo vazio",
                    minLength: {
                      value: 6,
                      message: "Senha deve possuir ao menos 6 caracteres"
                    },
                    pattern: {
                      value: /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/,
                      message: "Senha deve possuir ao menos um número e uma letra"
                    }
                  })}
                />
                <p className="text-warning">{errors?.password?.message}</p>
                <label htmlFor="password2" className="fs-6">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  name="password2"
                  placeholder="repita a senha"
                  id="password2"
                  className="form-control mb-1"
                  {...register("password2", {
                    validate: (val) => {
                      if (watch("password") !== val) {
                        return "Senhas não coincidem";
                      }
                    }
                  })}
                />
                <p className="text-warning">{errors?.password2?.message}</p>
                <button type="submit" className="mb-2 btn btn-outline-light">
                  Cadastrar-se
                </button>
                <p role="alert" hidden={!message} className={"text-center alert-dismissible alert alert-"+((message.slice(0,3)==="Err") ? "warning":"success")}>
                  <span>{message}</span>
                  <button type="button" className="btn-close" onClick={()=>setMessage("")}></button>
                </p>
                <Link
                  to="#"
                  className="my-1 p-1 w-100 link-light text-center"
                  onClick={() => {
                    setLogin(!login);
                  }}
                >
                  Já possuo cadastro
                </Link>
              </form>
            )}
            <div style={{fontSize: "0.61rem"}} className="text-muted pt-0">
              <p className="m-1">Testes</p>
              <p className="m-1" style={{ whiteSpace: "nowrap" }}>logar como&nbsp;
                <button 
                  className="border-0 btn btn-link link-light bg-primary text-decoration-none rounded p-0 text-center"
                  onClick={()=>{ handleDemoLogin("dev") }}
                  style={{fontSize: "0.61rem", lineHeight: 'inherit'}}
                >
                  dev
                </button> |&nbsp;
                <button 
                  className="border-0 btn btn-link link-light bg-primary text-decoration-none rounded p-0 text-center"
                  onClick={()=>{ handleDemoLogin("qa") }}
                  style={{fontSize: "0.61rem", lineHeight: 'inherit'}}
                >
                  qa
                </button> |&nbsp;
                <button 
                  className="border-0 btn btn-link link-light bg-primary text-decoration-none rounded p-0 text-center"
                  onClick={()=>{ handleDemoLogin("manager") }}
                  style={{fontSize: "0.61rem", lineHeight: 'inherit'}}
                >
                  gestor
                </button>
              </p>
              <p className="m-1">
                <button 
                  className="py-0 border-0 btn btn-link link-light bg-primary text-decoration-none rounded px-1 text-center"
                  onClick={()=>{ handleResetDb() }}
                  style={{fontSize: "0.61rem"}}
                >
                  resetar banco de dados
                </button>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Navigate to="/" />;
  }
}

export default Login;
