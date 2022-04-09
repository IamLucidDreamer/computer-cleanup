/* eslint-disable no-unused-expressions */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import logo from '../Assets/images/logo.svg';
import { SidebarData } from './SidebarData';
import { AuthContext } from '../../context/Authcontext';

const { Sider } = Layout;

export const Sidebar = (props) => {
  // eslint-disable-next-line react/prop-types
  const sidebarProps = props;

  const { userContext } = useContext(AuthContext);
  // eslint-disable-next-line dot-notation

  // console.log(userContext.access);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Sider
      className="pt-4"
      breakpoint="sm"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        // eslint-disable-next-line no-unused-expressions
        broken
          ? sidebarProps.setCollapsed({ collapsed: true })
          : sidebarProps.setCollapsed({ collapsed: false });
      }}
      trigger={null}
      collapsible
      collapsed={sidebarProps.collapsed.collapsed}
    >
      <div className="logo p-1">
        {' '}
        <img src={logo} alt="aamdhane-logo" />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
        {SidebarData.filter((item) => {
          if (item.isPermissionBased) {
            return userContext.access[item.key][1];
          }
          return true; // change it to false
        }).map((item, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <Menu.Item key={key} icon={<item.icon />}>
            <Link to={item.link}>{item.title}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};
