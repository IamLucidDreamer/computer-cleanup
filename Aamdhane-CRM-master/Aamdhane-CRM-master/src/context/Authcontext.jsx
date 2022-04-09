import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StateLessLoader } from '../Components/Common/Loader';
import { getLoggedInUser } from '../service/auth';
import { defaultPermissions } from '../common/configs';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [userContext, setUserContext] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getLoggedInUser()
      .then((user) => {
        setUserContext(user);
        localStorage.setItem('isLoggedIn', true);
      })
      .catch(() => {
        history.push('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <StateLessLoader />;
  return (
    <AuthContext.Provider
      value={{
        userContext,
        changeContext: (user) =>
          setUserContext(
            user ? { ...user, access: { ...defaultPermissions, ...user.access } } : undefined,
          ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
