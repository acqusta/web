import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';
import GitHubButton from 'react-github-button';
import BannerImage from './BannerImage';
import * as utils from '../utils';
import { Row, Col, Card, Menu, Icon } from 'antd';


const loop = {
  duration: 3000,
  yoyo: true,
  repeat: -1,
};

class Banner extends React.PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }
  static propTypes = {
    className: PropTypes.string,
  }
  static defaultProps = {
    className: 'banner',
  }
  render() {
    const { className, isMobile } = this.props;
    const { locale } = this.context.intl;
    const isZhCN = locale === 'zh-CN';
    return (
      <div>
      <Row>
        <div className="home-page-wrapper banner-wrapper banner" id="banner">
          <div className="masthead banner.text-center">
            <h1>Acqusta TQuant</h1>
            <h2>&nbsp;</h2>
            <h2>量化黑科技&nbsp;&nbsp;宽客新起点</h2>
            <h3>&nbsp;</h3>
            <div className="banner-btns" key="buttons">
              <Link className="banner-btn components" to={utils.getLocalizedPathname('/docs/manual/introduce', isZhCN)}>
                开始使用
              </Link>
              <a className="banner-btn"
              href='https://pan.baidu.com/s/1pNr9QVT'>
                下载
              </a>
            </div>
            <div>
              <a className="link" href="https://github.com/acqusta">GitHub开源社区</a>
              <h2>&nbsp;</h2>
            </div>
          </div>
        </div>
      </Row>
      <Row className="feature-row" type="flex" justify="space-around" >
        <Col className="feature-box" xxl={7} xl={7} lg={7} md={7} sm={12} xs={24}>
          <Card ><h3>内存数据库</h3><p>快人一步</p></Card>
        </Col>
        <Col className="feature-box" xxl={7} xl={7} lg={7} md={7} sm={12} xs={24}>
          <Card ><h3>行情网络</h3><p>随时随地获取数据</p></Card>
        </Col>
        <Col className="feature-box" xxl={7} xl={7} lg={7} md={7} sm={12} xs={24}>
          <Card ><h3>Tick回测</h3><p>飞一般的速度</p></Card>
        </Col>
        <Col className="feature-box" xxl={7} xl={7} lg={7} md={7} sm={12} xs={24}>
          <Card ><h3>极速交易</h3><p>股票、期货、基金交易，一个都不能少</p></Card>
        </Col>
        <Col className="feature-box" xxl={7} xl={7} lg={7} md={7} sm={12} xs={24}>
          <Card ><h3>分布式架构</h3><p>稳如磐石</p></Card>
        </Col>
        <Col className="feature-box"  xxl={7} xl={7} lg={7} md={7} sm={12} xs={24}>
          <Card ><h3>多编程语言</h3><p>Python, Java, JavaScript, C++,...</p></Card>
        </Col>
      </Row>
      </div>
    );
  }
}

export default Banner;
