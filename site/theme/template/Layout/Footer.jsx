import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, message, Row, Col } from 'antd';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.lessLoaded = false;

    this.state = {
      color: '#1890ff',
    };
  }

  componentDidMount() {
  }


  render() {
    return (
      <footer id="footer">
        <div className="footer-wrap">
          <Row>
            <Col>
              <ul className="list-inline footer-center text-center">
                <li>©2020 www.acqusta.com</li>
                <li><a href="http://www.beian.miit.gov.cn">沪ICP备17051960号-1</a></li>
              </ul>
            </Col>
          </Row>
        </div>
      </footer>
    );
  }
}

export default injectIntl(Footer);
