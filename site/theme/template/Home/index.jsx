import React from 'react';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import Banner from './Banner';
function getStyle() {
  return `
    // .main-wrapper {
    //   padding: 0;
    // }
    // #header {
    //   background-color #0;
    //   color: #fff;
    // }

    // .navbar {
    //   font-family:"Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","WenQuanYi Micro Hei",sans-serif;
    //   background-color: #000;
    //   color: #fff;
    // }

    // #header,
    // #header .ant-select-selection,
    // #header .ant-menu {
    //   background: transparent;
    // }
    // #header #logo {
    //   padding: 0;
    // }
    // #header .ant-row > div:last-child #search-box,
    // #header .ant-row > div:last-child .ant-select,
    // #header .ant-row > div:last-child .ant-menu,
    // #header .nav-phone-icon {
    //   display: none;
    // }
    // #header .ant-row > div:last-child .header-lang-button {
    //   margin-right: 0;
    // }
    // #header .ant-row .ant-col-lg-19,
    // #header .ant-row .ant-col-xl-19 {
    //   width: 50%;
    //   float: right;
    // }
    // footer .footer-wrap{
    //   width: 100%;
    //   padding: 0;
    // }
    // footer .bottom-bar{
    //   margin: auto;
    //   max-width: 1200px;
    //   padding: 16px 24px;
    // }
    // footer  .bottom-bar{
    //   border-top: none;
    // }
    // footer .footer-wrap .ant-row{
    //   width: 100%;
    //   max-width: 1200px;
    //   padding: 86px 24px 93px 24px;
    //   margin: auto;
    // }
    // @media only screen and (max-width: 767.99px) {
    //   #footer .footer-wrap{
    //     padding: 40px 24px
    //   }
    //   footer .footer-wrap .ant-row {
    //     padding: 0;
    //   }
    // }
  `;
}

/* eslint-disable react/prefer-stateless-function */
class Home extends React.Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }
  render() {
    const { isMobile, intl } = this.context;
    const childProps = { ...this.props, isMobile, locale: intl.locale };
    return (
      <DocumentTitle title='Acqusta TQuant - 快、稳、准，新一代量化交易框架'>
        <div className="main-wrapper">
          <Banner {...childProps} />
          {/* <style dangerouslySetInnerHTML={{ __html: getStyle() }} /> */}
        </div>
      </DocumentTitle>
    );
  }
}

export default injectIntl(Home);
