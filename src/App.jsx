import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthGoogleProvider } from "./contexts/authGoogle";
import { PrivateRoutes } from "./components/PrivateRoutes";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContainer from "./components/MainContainer";
import BgContainer from "./components/BgContainer";

import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

import Groups from "./pages/groups/List";
import Group from "./pages/groups/Group";
import NewGroup from "./pages/groups/New";
import UpdateGroup from "./pages/groups/Update";

import Issues from "./pages/issues/List";
import Issue from "./pages/issues/Issue";
import NewIssue from "./pages/issues/New";
import UpdateIssue from "./pages/issues/Update";

import Solutions from "./pages/solutions/List";
import Solution from "./pages/solutions/Solution";
import NewSolution from "./pages/solutions/New";
import UpdateSolution from "./pages/solutions/Update";
import Login from "./pages/Login";
import Complete from "./pages/Complete";

function App() {
  return (
    <AuthGoogleProvider>
      <BgContainer>
        <Navbar />
        <Sidebar />
        <MainContainer>
          <Routes>
            <Route path="/" element={<PrivateRoutes />}>
              <Route path="/" element={<Dashboard />} index />
              <Route path="settings" element={<Settings />} />

              <Route path="groups" element={<Groups />} />
              <Route path="groups/:id" element={<Group />} />
              <Route path="groups/new" element={<NewGroup />} />
              <Route path="groups/:id/update" element={<UpdateGroup />} />

              <Route path="issues/" element={<Issues />} />
              <Route path="issues/:id" element={<Issue />} />
              <Route path="issues/new" element={<NewIssue />} />
              <Route path="issues/:id/update" element={<UpdateIssue />} />

              <Route path="solutions" element={<Solutions />} />
              <Route path="solutions/:id" element={<Solution />} />
              <Route path="solutions/new" element={<NewSolution />} />
              <Route path="solutions/:id/update" element={<UpdateSolution />} />
            </Route>
            <Route path="complete" element={<Complete />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </MainContainer>
      </BgContainer>
    </AuthGoogleProvider>
  );
}

export default App;
