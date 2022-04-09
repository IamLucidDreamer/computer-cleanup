/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Image, Input, Form, Card, InputNumber, message } from 'antd';

import { CloseOutlined, InboxOutlined, ReloadOutlined } from '@ant-design/icons';

import { HCLayout } from './Layout/HCLayout';

import { request } from '../service/common';

const AppData = () => {
  const [multiplier, setMultiplier] = useState();

  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    request('/api/salary/multiplier', 'GET')
      .then((data) => {
        setMultiplier(data.multiplier);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchData();
    console.log(multiplier);
  }, []);

  const changeMultiplier = (values) => {
    const multi = parseInt(values.multiplier, 10);
    request('/api/salary/multiplier', 'PATCH', { data: { multiplier: multi } })
      .then(() => {
        setMultiplier(values.multiplier);
        message.success('Multiplier Updated');
      })
      .catch((error) => console.log(error));
  };

  const actionBtn = [
    <Button type="primary" onClick={fetchData}>
      <ReloadOutlined />
    </Button>,
  ];
  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="App Data"
      actions={actionBtn}
    >
      <Row>
        <Col span={12}>
          <Card title="Salary Multiplier">
            <h3>Current Multiplier : {multiplier} </h3> <br />
            <Form layout="inline" onFinish={changeMultiplier}>
              <Form.Item
                key="multiplier"
                initialValue={multiplier}
                label=""
                name="multiplier"
                rules={[{ required: true, message: 'Enter a valid multiplier' }]}
              >
                <InputNumber style={{ width: 200 }} key="multiplier" />
              </Form.Item>
              <Form.Item key="btn">
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </HCLayout>
  );
};

export { AppData };
