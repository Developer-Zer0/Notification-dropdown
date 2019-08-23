import React from 'react';
import { Row, Col, Menu, Icon } from 'antd';
import NotificationIcon from '../notification_icon/notification_icon'
import '../notification_icon/notification_icon.css'

class Navbar extends React.Component {
    constructor(){
        super();
        this.state = {
        };
    }
    

  render() {
    return (
      <Row type='flex' justify='end'>
          <Col span={24}>
          <Menu mode="horizontal">
                <Menu.Item key="mail">
                    <Icon type="mail" />
                    Navigation One
                </Menu.Item>
                <Menu.Item style={{float: 'right'}} >

                    <NotificationIcon/>

                </Menu.Item>
            </Menu>
          </Col>
      </Row>
    );
  }
}

export default Navbar;