import React from 'react';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';
import * as utils from '../utils';
import { Row, Col, Card, Menu, Icon } from 'antd';

function getStyle() {
  return `
    .regbox {
      width: 100%;
      padding: 80px 0 0;//0px 0 80px;
      margin-bottom: 0;
      color: #000000;
      align-items: center;
      height: 600px;
      min-height: 100%;
      text-align: center;
    }
    `;
}

/* eslint-disable react/prefer-stateless-function */
class Register extends React.Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }
  render() {
    const { isMobile, intl } = this.context;
    const childProps = { ...this.props, isMobile, locale: intl.locale };
    return (
      <DocumentTitle title='注册 - TQuant'>
        <div className="regbox">
            <h2>建站中，请微信联系获取免费帐号。</h2>
            <br/>              
            <Link to=""><h2>微信：tquant</h2></Link>
            <br/>
            <img width="200" src="/docs/tquant_weixin.jpg"></img>
            <style dangerouslySetInnerHTML={{ __html: getStyle() }} />
        </div>  
      </DocumentTitle>
    );
  }
}

export default injectIntl(Register);
