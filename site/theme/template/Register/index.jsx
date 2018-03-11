import React from 'react';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';
import * as utils from '../utils';
import { Form, Row, Col, Card, Menu, Icon } from 'antd';

import RegistrationForm from './RegistrationForm';

function getStyle() {
  return `
    .regbox {
      // display: flex;
      // justify-content: center;
      align-items: center;
      //position: absolute;      
      //width: 100%;
      justify-content: center;
      padding: 40px 0 80px 0;//0px 0 80px;
      margin:0 auto;
      margin-bottom: 80;
      color: #000000;
      align-items: center;
      //height: 600px;
      min-height: 100%;
      text-align: center;
      max-width: 800px;
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
    const WrappedRegistrationForm = Form.create()(RegistrationForm);
    return (
      <DocumentTitle title='注册 - TQuant'>
        <div className="regbox">
          <Row type="flex" justify="space-around" >
            <Col xxl={18} xl={18} lg={18} md={18} sm={20} xs={20}>            
              <WrappedRegistrationForm ></WrappedRegistrationForm>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={6} sm={24} xs={24}>
              <div>
                <h3>有任何问题，请微信联系。 微信：tquant</h3>
                <img width="150" src="/docs/tquant_weixin.jpg"></img>
              </div>
            </Col>
          </Row>
          <style dangerouslySetInnerHTML={{ __html: getStyle() }} />
        </div>
      </DocumentTitle>
    );
  }
}

export default injectIntl(Register);
