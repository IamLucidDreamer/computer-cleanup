import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { SHCLayout } from './Components/Layout/SHCLayout';
import { Login } from './Components/Login';
import { Dashboard } from './Components/Common/Dashboard';

import { Labour } from './Components/Labour';
import { MillTypes } from './Components/MillTypes';
import { Factory } from './Components/Factory';
import { Salary } from './Components/Salary';
import { Commission } from './Components/Commission';
import { MiddleMan } from './Components/MiddleMan';
import { Admin } from './Components/Admin';
import { Approval } from './Components/Approval';

import { AppData } from './Components/app-data';
import { Jobs } from './Components/Jobs';
// import { JobApplications } from './Components/Layout/JobApplications';
// import { Applications } from './Components/Applications';
import { Support } from './Components/Support';
import { Notifications } from './Components/Notifications';
import 'antd/dist/antd.css';

import { logout } from './service/auth';
import { AuthContext, AuthProvider } from './context/Authcontext';
import { MiddleManLabours } from './Components/MiddlemanLabours';
import { Flyers } from './Components/flyers';
import { Inactives } from './Components/Inactives';
import { MappedUsers } from './Components/MappedUsers';

const Logout = () => {
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const { changeContext } = useContext(AuthContext);
  useEffect(() => {
    logout()
      .catch(() => console.log('err'))
      .finally(() => {
        changeContext(undefined);

        setLogoutSuccess(true);
      });
  }, []);
  if (!logoutSuccess) return null;

  return <Redirect to="/login" />;
};

export const App = () => (
  <BrowserRouter>
    <Switch>
      <AuthProvider>
        <SHCLayout>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={Dashboard} />
          <Route path="/labourer" component={Labour} />
          <Route path="/factory" component={Factory} />
          <Route path="/salary" component={Salary} />
          <Route path="/commission" component={Commission} />
          <Route path="/agent" component={MiddleMan} />
          <Route path="/agent-labourer" component={MiddleManLabours} />
          <Route path="/milltype" component={MillTypes} />
          <Route path="/flyers" component={Flyers} />
          <Route path="/support" component={Support} />
          <Route path="/admin" component={Admin} />
          <Route path="/approval" component={Approval} />
          <Route path="/inactives" component={Inactives} />
          <Route path="/job" exact component={Jobs} />
          <Route path="/app-data" exact component={AppData} />
          <Route path="/mapped-users" exact component={MappedUsers} />
          <Route path="/notification" exact component={Notifications} />
        </SHCLayout>
      </AuthProvider>
    </Switch>
  </BrowserRouter>
);

// eslint-disable-next-line import/no-default-export
export default App;
