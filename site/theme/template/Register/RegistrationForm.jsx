import React from 'react';
import { injectIntl } from 'react-intl';
import { message, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    next_sms_countdown : 0,
    btnSmsCaptchaTitle : '获取验证码',
    btnSmsCaptchaDisable : false,
    imgCaptchaData : "",
    imgCaptchaSeq : 0,
    next_submit_countdown : 0,
    btnSumitDisabled : false,
    btnSumitTitle: "注册、修改密码",
  };
  componentDidMount() {
    //this.host = "http://127.0.0.1:5000";
    this.host = "";
    this.timer = setInterval( this.onCountDown, 1000);
    this.refreshTimer = setTimeout( this.refreshImgCaptcha, 1000);
  }
  componentWillUnmount() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    this.timer && clearInterval(this.timer);
  }

  onCountDown = () => {
    this.onSmsCountDown();
    this.onSubmitCountDown();
  }

  onSubmitCountDown = () => {
    if (this.state.next_submit_countdown == -100) {
      this.setState ({
        btnSumitDisabled : true
      })
    } else if (this.state.next_submit_countdown <= 0) {
      this.setState ({
        btnSumitDisabled : false,
        btnSumitTitle: "注册、修改密码"
      })
    } else {
      this.state.next_submit_countdown -= 1;
      var title = "注册、修改密码(" + this.state.next_submit_countdown + ")"
      this.setState ({
        btnSumitDisabled : true,
        btnSumitTitle : title
      })
    }
  }
  onSmsCountDown = () => {
    if (this.state.btnSumitDisabled) {
      this.setState({
        btnSmsCaptchaDisabled : true,
        btnSmsCaptchaTitle    : "获取验证码"
      });
      return;
    }

    if (this.state.next_sms_countdown <= 0) {
      if (this.state.btnSmsCaptchaDisabled) {
        this.setState({
          btnSmsCaptchaDisabled : false,
          btnSmsCaptchaTitle    : "获取验证码"
        });
      }
    } else {
      this.state.next_sms_countdown -= 1;
      var title = "获取验证码(" + this.state.next_sms_countdown + ")";
      this.setState( {
        btnSmsCaptchaDisabled : true,
        btnSmsCaptchaTitle    : title
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.state.btnSmsCaptchaDisable = true;
        this.state.next_sms_countdown = 60;
        var phone = values['phone'];
        var img_captcha = values['img_captcha'];
        var url = this.host + "/api/reg_user?phone=" + phone 
                + "&img_value=" + img_captcha
                + "&img_seq=" + this.state.imgCaptchaSeq
                + "&password=" + values['password']
                + "&sms_captcha=" + values['sms_captcha'];

        fetch(url).then(
          function (res) {
            res.json().then(
              function(r) {
                if (r.success) {
                  this.state.next_submit_countdown = -100;
                  this.setState({
                    btnSmsCaptchaDisabled : true,
                    btnSumitDisabled : true
                  })
                    
                  message.success(r.msg);
                }
                else {
                  this.state.next_submit_countdown = 10;
                  message.error(r.msg);
                }
              }.bind(this)
            );
          }.bind(this),
          function (e) {
            message.error(e);
          }
        );
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && /\W/.test(value)) {
        callback("只能包括数字和大小写字符！")
    } else if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
      callback()
    } else {
      callback();
    }
  }

  validatePhone = (rule, value, callback) => {
    if(!(/^1[35789]\d{9}$/.test(value))){
      callback('手机号码不正确');
    } else {
      callback();
    }
  }

  refreshImgCaptcha = (e) => {
    this.refreshTimer = null;
    this.props.form.setFields({img_captcha : ""});
    fetch(this.host + "/api/get_capc").then(
      function (res) {
        res.json().then(
          function(r) {
            this.setState({
              imgCaptchaSeq : r.seq,
              imgCaptchaData : r.img
            });
          }.bind(this)
        );
      }.bind(this),
      function (e) {
        console.log('get_capc error', e)
      }

    )
  }
  onBtnSmsCaptcha = (e) => {
    this.props.form.validateFields(['phone','img_captcha'], (e,v) => {
      if (e!=undefined) {
      } else {
        this.state.btnSmsCaptchaDisable = true;
        this.state.next_sms_countdown = 60;
        var phone = v['phone'];
        var img_captcha = v['img_captcha'];
        var url = this.host + "/api/send_sms_captcha?phone=" + phone 
                + "&img_value=" + img_captcha
                + "&img_seq=" + this.state.imgCaptchaSeq;

        fetch(url).then(
          function (res) {
            res.json().then(
              function(r) {                
                this.setState({
                  next_sms_countdown : r.next_countdown,
                });
                if (r.success)
                  message.success(r.msg);
                else
                  message.error(r.msg);
              }.bind(this)
            );
          }.bind(this),
          function (e) {
            message.error(e);
          }
        );
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const { isMobile } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formTitleLayout = {
      labelCol: {
        xs: { span: 24, offset:0 },
        sm: { span: 22, offset:2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {!isMobile? (
            <div style={{ textAlign: 'center' }}>
              <h2>请使用手机号码注册tqc客户端的账号</h2>
              <h3>手机号码是tqc客户端的用户名，注意登陆时不需要输入 +86</h3>
            </div>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <h3>请使用手机号码注册tqc客户端的账号。手机号码是tqc客户端的用户名，注意登陆时不需要输入 +86</h3>
            </div>
          )
          }
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="手机号码"
        >
          {getFieldDecorator('phone', {
            rules: [{ 
              required: true, message: '请输入你的手机号码'
            }, {
              validator: this.validatePhone,
            }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </FormItem>
      
        <FormItem
          {...formItemLayout}
          label="密码"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请确认密码!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="图片验证码"
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('img_captcha', {
                rules: [{ required: true, message: '请输入图片验证码' }],
              })(
                <Input />
              )}
            </Col>
            <Col span={12}>
              <img width="80" height="30" src={this.state.imgCaptchaData} onClick={this.refreshImgCaptcha}/>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="短信验证码"
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('sms_captcha', {
                rules: [{ required: true, message: '请输入短信验证码' }],
              })(
                <Input />
              )}
            </Col>
            <Col span={12}>
              <Button disabled={this.state.btnSmsCaptchaDisabled} onClick={this.onBtnSmsCaptcha}>{this.state.btnSmsCaptchaTitle}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button disabled={this.state.btnSumitDisabled} type="primary" htmlType="submit">{this.state.btnSumitTitle}</Button>
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(RegistrationForm);
