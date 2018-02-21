import React from 'react';


const redirect = {
  '/docs/resource/download': '/docs/spec/download',
  '/docs/resource/download-cn': '/docs/spec/download-cn',
  '/docs/resource/reference': '/docs/spec/reference',
  '/docs/resource/reference-cn': '/docs/spec/reference-cn',
};

export default class Redirect extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    const pathname = `/${location.pathname}`;
    Object.keys(redirect).forEach((from) => {
      if (pathname.indexOf(from) === 0) {
        window.location.href = redirect[from];
      }
    });
  }

  render() {
    return <div />;
  }
}
