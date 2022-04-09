import React from 'react';
import { Space, Spin } from 'antd';

export const StateLessLoader = ({ size = 'large' }) => (
  <div className="w-screen h-screen flex justify-center align-center">
    <Space>
      <Spin tip="Getting user information..." size={size} />
    </Space>
  </div>
);
