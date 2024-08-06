import { Link } from "react-router-dom";
import {
  GroupAddTwoTone,
  AssessmentTwoTone,
  PostAddTwoTone,
  AddTaskTwoTone,
  Groups2TwoTone,
  ListAltTwoTone,
  HomeRepairServiceTwoTone
} from "@mui/icons-material";
import { useContext, useState, useEffect, Fragment } from "react";
import { AuthGoogleContext } from "../../contexts/authGoogle";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./style.css";

function Dashboard() {
  const { user } = useContext(AuthGoogleContext);
  const [followList, setFollowList] = useState([])
  const [userReports, setUserReports] = useState([])
  const sub = (qtd,first=true,x) => {
    if (first) x = new Date()
    if (qtd==0)
      return (x.getDate() + "/" + (x.getMonth()+1))
    return sub(--qtd,false,new Date(x.setDate(x.getDate()-7)))
  }
  const getLastSunday = () => {
    var t = new Date();
    t.setDate(t.getDate() - t.getDay());
    return t;
  }
  const now = getLastSunday().getDate() + "/" + (getLastSunday().getMonth()+1)
  const [data, setData] = useState([
    ["x", "Soluções de Causa-Raiz cadastradas", "Problemas cadastrados", "Problemas resolvidos", "Problemas resolvidos com atraso",],
    [sub(6), 0, 2, 4, 2],
    [sub(5), 3, 4, 5, 1],
    [sub(4), 0, 7, 6, 2],
    [sub(3), 1, 4, 4, 2],
    [sub(2), 2, 3, 7, 3],
    [sub(1), 1, 5, 5, 1],
    [now,    1, 8, 4, 0],
  ]);
  let role = user.localData ? user.localData.role : "d"
  const themeColorException =
    localStorage.getItem("theme") === "quartz" ||
    localStorage.getItem("theme") === "vapor" ||
    localStorage.getItem("theme") === "minty" ||
    localStorage.getItem("theme") === "pulse";
  let bg 
  let txtColor
  if (localStorage.getItem("dark") === "true") {
    bg = "#33333346"
    txtColor = "#ddd"
  } else {
    bg = "#ffffff46"
    txtColor = "#444"
  }
  
  const options = {
    backgroundColor: { fill:'transparent' },
    
    hAxis: {
      title: "Semana",
      titleTextStyle: {
        color: txtColor
      },
      textColor: txtColor
    },
    vAxis: {
      title: "Ocorrência",
      titleTextStyle: {
        color: txtColor
      },
      minValue: 0,
      textColor: txtColor,
      viewWindowMode:'explicit',
      viewWindow:{
        min:0
      },
    },
    legend: {
      textStyle: {
        color: txtColor
      },
    },
    series: {
      2: { curveType: "function" },
      3: { curveType: "function" },
    },
    animation: {
      startup: true,
      easing: "out",
      duration: 1000,
    },
  };
  async function getData(){
    await axios.get(`${import.meta.env.VITE_SERVER}/report/${user.localData.id}`)
      .then(async (res)=>{ setUserReports(res.data.result) })
    await axios.get(`${import.meta.env.VITE_RTDB_ENDPOINT}/following/${user.localData.id}.json`)
      .then(async (res)=>{ setFollowList(res.data) })
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pt-md-4 pt-xl-5 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>
      <div className="row">
        <div className="col-12 row btn-row">
          {(role==="g") &&
            <Link
              to="groups/new"
              className={
                "btn btn-square mb-2 btn-" +
                (themeColorException ? "outline-secondary" : "outline-primary")
              }
              color="secondary"
            >
              <GroupAddTwoTone />
              <p>Novo Grupo Solucionador</p>
            </Link>
          }
          {(role==="g" || role==="q") && <Link
            to="issues/new"
            className={
              "btn btn-square mb-2 btn-" +
              (themeColorException ? "outline-secondary" : "outline-primary")
            }
          >
            <PostAddTwoTone />
            <p>Novo Ticket de Problema</p>
          </Link>}
          {(role==="d") && <Link
            to="solutions/new"
            className={
              "btn btn-square mb-2 btn-" +
              (themeColorException ? "outline-secondary" : "outline-primary")
            }
          >
            <AddTaskTwoTone />
            <p>Nova Solução de Causa Raiz</p>
          </Link>}
          <Link
            to="groups"
            className={
              "btn btn-square mb-2 btn-" +
              (themeColorException ? "outline-secondary" : "outline-primary")
            }
          >
            <Groups2TwoTone />
            <p>Listar Grupos Solucionadores</p>
          </Link>
          <Link
            to="issues"
            className={
              "btn btn-square mb-2 btn-" +
              (themeColorException ? "outline-secondary" : "outline-primary")
            }
          >
            <ListAltTwoTone />
            <p>Listar Tickets de Problema</p>
          </Link>
          <Link
            to="solutions"
            className={
              "btn btn-square mb-2 btn-" +
              (themeColorException ? "outline-secondary" : "outline-primary")
            }
          >
            <HomeRepairServiceTwoTone />
            <p>Listar Soluções de Causa-Raiz</p>
          </Link>
          <Link
            to="settings"
            className={
              "btn btn-square mb-2 btn-" +
              (themeColorException ? "outline-secondary" : "outline-primary")
            }
          >
            <AssessmentTwoTone />
            <p>Relatório Gerencial</p>
          </Link>
        </div>
        {(role === "g" || role === "q") && 
          <div className="col-12 mb-3">
            <h3>Tickets de problema acompanhados</h3>
            <p style={{textAlign: 'justify'}}>
              {followList?.map((issId) => (
                <Fragment key={issId}><Link to={`/issues/${issId}`}>{`[TP${issId.slice(0,9)}...]`}</Link> </Fragment>
              ))}
              {(followList?.length<=0) && "N/A"}
            </p>
          </div>
        }
        {(role === "g" || role === "q") && 
          <div className="col-12 mb-3">
            <h3>Seus tickets em andamento</h3>
            <p style={{textAlign: 'justify'}}>
              {userReports?.userCreatedOngoingTp?.map((iss) => (
                <span key={iss.id}>
                  <Link 
                   to={`/issues/${iss.id}`} 
                   className={(new Date(iss.prev_conclusion)-new Date()<0) ? "text-danger":""}
                  >
                    {`[TP${iss.id.slice(0,9)}...]`}
                  </Link> 
                </span>
              ))}
              {(userReports?.userCreatedOngoingTp?.length<=0) && <>N/A</>}
            </p>
          </div>
        }
        {(role === "d") && 
          <div className="col-12 mb-3">
            <h3>Tickets em andamento nos seu(s) grupo(s)</h3>
            <div style={{textAlign: 'justify'}}>
              {userReports?.userGroups?.map((group) => (
                <p key={group.id}>
                  <Link to={`/groups/${group.id}`}>{`${group.name}`}</Link> 
                  <span>: </span>
                  {userReports?.userOngoingTp?.map((iss) => (
                    (iss.group_id === group.id) &&
                      <Link 
                       key={iss.tp_id}
                       to={`/issues/${iss.tp_id}`}
                       className={(new Date(iss .tp_prev_conclusion)-new Date()<0) ? "text-danger":""}
                      >
                        {`[TP${iss.tp_id.slice(0,9)}...]`}
                      </Link> 
                  ))}
                </p>
              ))}
            </div>
            {(userReports?.userGroups?.length<=0) && <>N/A</>}
          </div>
        }
        
        {/* <div 
         className="chart col-12 mb-3"
        >
          <Chart chartType="LineChart" width="100%" height="400px" data={data} options={options} />
        </div> */}
      </div>
      <p className="text-center">
        <a
          className="text-muted"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Projeto-e-Construcao-de-Sistemas-2022-2/Grupo3-Ticket.io-Client"
        >
          <small>código fonte</small>
        </a>
      </p>
    </>
  );
}

export default Dashboard;
