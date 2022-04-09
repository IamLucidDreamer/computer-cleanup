/* eslint-disable no-console */
import React, { useState, useContext, useEffect } from 'react';

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { request } from '../service/common';
import './Login.css';
import logo from './Assets/images/logo.svg';
import { AuthContext } from '../context/Authcontext';

export const Login = () => {
  const context = useContext(AuthContext);
  const { userContext, changeContext } = context;
  const history = useHistory();
  const [disableLoginButton, setDisableLoginButton] = useState(true);
  useEffect(() => {
    if (userContext) history.push('/');
  }, [userContext]);

  const onFinish = (values) => {
    console.log(values);
    setDisableLoginButton(false);
    request('/api/auth/login', 'POST', {
      data: values,
    })
      .then(async (data) => {
        setDisableLoginButton(true);
        changeContext(data.user);
        localStorage.setItem('isLoggedIn', true);
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
        setDisableLoginButton(true);
        localStorage.setItem('isLoggedIn', false);
      });
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="container p-5">
      <div className="grid grid-cols-1 m-auto loginContainer">
        <center>
          <img src={logo} className="w-2/4  py-4" alt="Aamdhane-logo" />
        </center>

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item> */}

          <Form.Item>
            <Button
              disabled={!disableLoginButton}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
