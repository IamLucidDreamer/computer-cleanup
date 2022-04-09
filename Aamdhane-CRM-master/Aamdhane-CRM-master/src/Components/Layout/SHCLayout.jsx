import React, { useState, useContext } from 'react';
import { Layout } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import { Sidebar } from '../Common/Sidebar';
import { AuthContext } from '../../context/Authcontext';

const { Header, Content } = Layout;

// eslint-disable-next-line react/prop-types
export const SHCLayout = ({ children }) => {
  const [state, setState] = useState({
    collapsed: false,
  });

  const toggle = () => {
    setState({
      collapsed: !state.collapsed,
    });
  };

  const style = {
    fontFamily: 'poppins',
  };

  const { userContext } = useContext(AuthContext);

  return (
    // eslint-disable-next-line react/jsx-filename-extension

    <Layout className="h-screen" style={style}>
      {!!userContext && <Sidebar collapsed={state} setCollapsed={setState} />}

      <Layout className="site-layout">
        {/* {localStorage.getItem('isLoggedIn') ? ( */}
        {!!userContext && (
          <Header
            className="site-layout-background"
            theme="light"
            style={{ color: '#fff', fontSize: '21px' }}
          >
            {React.createElement(state.collapsed ? DoubleRightOutlined : DoubleLeftOutlined, {
              className: 'trigger',
              onClick: toggle,
            })}
          </Header>
        )}
        {/* ) : null} */}
        <Content
          className="site-layout-background"
          style={{
            margin: '8px 16px',
            // padding: ,
            minHeight: 280,
            overflowX: 'scroll',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
