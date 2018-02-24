import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Select, Menu, Row, Col, Icon, Popover, Input, Badge, Button } from 'antd';
import * as utils from '../utils';
import { version as antdVersion } from '../../../../package.json';

const { Option } = Select;

let docsearch;
if (typeof window !== 'undefined') {
  docsearch = require('docsearch.js'); // eslint-disable-line
}

function initDocSearch(locale) {
  if (!docsearch) {
    return;
  }
  const lang = locale === 'zh-CN' ? 'cn' : 'en';
  // FIXME: use my key
  docsearch({
    apiKey: '60ac2c1a7d26ab713757e4a081e133d0',
    indexName: 'ant_design',
    inputSelector: '#search-box input',
    algoliaOptions: { facetFilters: [`tags:${lang}`] },
    transformData(hits) {
      hits.forEach((hit) => {
        hit.url = hit.url.replace('www.acqusta.com', location.host);
        hit.url = hit.url.replace('https:', location.protocol);
      });
      return hits;
    },
    debug: false, // Set debug to true if you want to inspect the dropdown
  });
}

export default class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  state = {
    menuVisible: false,
  };

  componentDidMount() {
    const { intl, router } = this.context;
    router.listen(this.handleHideMenu);
    const { searchInput } = this;
    /* eslint-disable global-require */
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 83 && event.target === document.body) {
        searchInput.focus();
      }
    });

    //initDocSearch(intl.locale);
    /* eslint-enable global-require */
  }

  handleShowMenu = () => {
    this.setState({
      menuVisible: true,
    });
  }

  handleHideMenu = () => {
    this.setState({
      menuVisible: false,
    });
  }

  onMenuVisibleChange = (visible) => {
    this.setState({
      menuVisible: visible,
    });
  }

  render() {
    const { menuVisible } = this.state;
    const { isMobile } = this.context;
    const menuMode = isMobile ? 'inline' : 'horizontal';
    const {
      location, themeConfig,
    } = this.props;
    // const docVersions = { ...themeConfig.docVersions, [antdVersion]: antdVersion };
    // const versionOptions = Object.keys(docVersions)
    //   .map(version => <Option value={docVersions[version]} key={version}>{version}</Option>);
    const module = location.pathname.replace(/(^\/|\/$)/g, '').split('/').slice(0, -1).join('/');
    let activeMenuItem = module || 'home';
    // if (activeMenuItem === 'components' || location.pathname === 'changelog') {
    //   activeMenuItem = 'docs/react';
    //}
    const { locale } = this.context.intl;
    const isZhCN = locale === 'zh-CN';

    const headerClassName = classNames({
      clearfix: true,
      navbar: true,
    });

    const menu = [
      <Menu className="menu-site" mode={menuMode} selectedKeys={[activeMenuItem]} id="nav" key="nav">
        <Menu.Item key="home">
          <Link to='/'>
            首页
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/arch">
          <Link to='/docs/arch/introduce'>
            介绍
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/doc">
          <Link to='/docs/manual/introduce'>
            文档
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/download">
          <a href='https://pan.baidu.com/s/1pNr9QVT'>
            下载
          </a>
        </Menu.Item>
      </Menu>,
    ];

    //const searchPlaceholder = locale === 'zh-CN' ? '在acqusta.com 中搜索' : 'Search in acqusta.com';
    const searchPlaceholder = '在acqusta.com中搜索';
    return (
      <header id="header" className={headerClassName}>
        {isMobile && (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon
              className="nav-phone-icon"
              type="menu"
              onClick={this.handleShowMenu}
            />
          </Popover>
        )}
        <Row>
          <Col xxl={4} xl={5} lg={5} md={6} sm={24} xs={24}>
            <Link to={utils.getLocalizedPathname('/', isZhCN)} id="logo">
              <img alt="logo" src="/acqusta.png" />
              <span><b>Acqusta TQuant</b></span>
            </Link>
          </Col>
          <Col xxl={20} xl={19} lg={19} md={18} sm={0} xs={0}>
            {/* <div id="search-box">
              <Icon type="search" />
              <Input ref={ref => this.searchInput = ref} placeholder={searchPlaceholder} />
            </div> */}
            {!isMobile && menu}
          </Col>
        </Row>
      </header>
    );
  }
}
