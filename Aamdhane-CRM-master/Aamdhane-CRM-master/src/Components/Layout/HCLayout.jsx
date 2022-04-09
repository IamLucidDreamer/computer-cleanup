import React from 'react';
import { PageHeader } from 'antd';

const HCLayout = ({ children, actions = [], onBack, title }) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <div
    className="site-page-header-ghost-wrapper"
    style={{ padding: '0px', backgroundColor: '#F0F2F5' }}
  >
    <PageHeader
      ghost={false}
      onBack={onBack}
      title={title}
      style={{ padding: '16px 0px', backgroundColor: '#F0F2F5', overflow: 'hidden' }}
      // subTitle="This is a subtitle"
      extra={actions}
    />
    {children}
  </div>
);

export { HCLayout };
