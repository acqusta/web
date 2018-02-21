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
      <div className="home-page-wrapper banner-wrapper banner" id="banner">
        <div className="masthead banner.text-center">
          <h1>Acqusta TQuant</h1>
          <h2>&nbsp;</h2>
          <h2>量化黑科技</h2>
          <h2>&nbsp;</h2>
          <h2>专注日内交易</h2>
          <div className="banner-btns" key="buttons">
            <Link className="banner-btn components" to={utils.getLocalizedPathname('/docs/manual/introduce', isZhCN)}>
              开始使用
            </Link>
            <Link className="banner-btn language" to={utils.getLocalizedPathname('/docs/arch/introduce', isZhCN)}>
              下载
            </Link>
          </div>
          <div>
            <a href="https://github.com/acqusta">GitHub开源社区</a>
          </div>
          <div>
            <Link to="">微信：@tquant</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
