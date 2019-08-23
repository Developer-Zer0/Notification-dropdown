import React from 'react';
import ReactDOM from 'react-dom';
import { Menu, Dropdown, Icon, List, Avatar, Spin, Tabs } from 'antd';
import { Badge } from 'antd';
import './notification_icon.css'
import reqwest from 'reqwest';
import InfiniteScroll from 'react-infinite-scroller';
//import MenuContext from 'antd/lib/menu/MenuContext';

//const { SubMenu } = Menu;
const { TabPane } = Tabs;

const fakeDataUrl = 'https://randomuser.me/api/?results=20&inc=name,gender,email,nat&noinfo';

class NotificationIcon extends React.Component {
    constructor() {
        super();

        this.state = {

            readNotif: 0,
            visible: false,
            unreadNotifications: [],
            bookmarkNotifications: [],
            notifications: [],
            loading: false,
            hasMore: true

        }

        this.filterNotifications = this.filterNotifications.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    clearNotification = e => {

        console.log('e ' + e);
        console.log(this.state.notifications);
        var idx = this.state.unreadNotifications.findIndex(function (notif) {
            return notif.email === e;
        });
        console.log('idx ' + idx);

        var newNotifArray = this.state.unreadNotifications;

        if (this.state.unreadNotifications[idx].read === 1) {

            this.setState({ readNotif: this.state.readNotif - 1 });
        }
        newNotifArray[idx].read = 1;
        newNotifArray.splice(idx, 1);
    
        this.setState({ unreadNotifications: newNotifArray });
        
    }

    clearBookmarkNotification = e => {

        var idx = this.state.bookmarkNotifications.findIndex(function (notif) {
            return notif.email === e;
        });

        var newNotifArray = this.state.bookmarkNotifications;

        newNotifArray.splice(idx, 1);
    
        this.setState({ bookmarkNotifications: newNotifArray });
        
    }

    bookmarkNotification = e => {

        var idx = this.state.unreadNotifications.findIndex(function (notif) {
            return notif.email === e;
        });

        var newNotifArray = this.state.unreadNotifications;
        var newBookmarkNotifArray = this.state.bookmarkNotifications;
        var firstname = newNotifArray[idx].name.first.toString();
        console.log(firstname.length);
        var email = newNotifArray[idx].email.toString();
        var bookmarknotif = {
            name: {first: firstname},
            email: email,
            bookmark: true,
        }

        newBookmarkNotifArray.push(bookmarknotif);

        if (this.state.unreadNotifications[idx].read === 1) {

            this.setState({ readNotif: this.state.readNotif - 1 });
        }
        newNotifArray[idx].read = 1;
        newNotifArray.splice(idx, 1);

        this.setState({ unreadNotifications: newNotifArray });
        this.setState({ bookmarkNotifications: newBookmarkNotifArray });
        //console.log(this.state.bookmarkNotifications[idx].name.first);
    }

    notificationClick = e => {

        window.open("https://ant.design", "_blank");

        var idx = this.state.unreadNotifications.findIndex(function (notif) {
            return notif.email === e;
        });
        var newNotifArray = this.state.unreadNotifications;

        if(newNotifArray.bookmark != true){

            var newReadNotif = this.state.readNotif + 1;

            newNotifArray[idx].read = 1;

            this.setState({ unreadNotifications: newNotifArray });
            this.setState({ readNotif: newReadNotif });

        }
    }

    filterNotifications() {
        this.setState({
            unreadNotifications: this.state.notifications.filter(function (notification) {
                console.log('hey' + notification.read)
                return notification.read !== 1;
            })
        })
    }

    toggleDropdown() {
        var toggleVisible = !this.state.visible
        this.setState({ visible: toggleVisible })
    }


    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);

        this.fetchData(res => {
            this.setState({
                notifications: res.results,
            });
            console.log(this.state.notifications)
            this.filterNotifications();
        });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    fetchData = callback => {
        reqwest({
            url: fakeDataUrl,
            type: 'json',
            method: 'get',
            contentType: 'application/json',
            success: res => {
                callback(res);
            },
        });
    };

    handleInfiniteOnLoad = () => {
        let { notifications } = this.state;
        this.setState({
            loading: true,
        });
        if (notifications.length > 5) {
            //message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData(res => {
            notifications = notifications.concat(res.results);
            this.setState({
                notifications,
                loading: false,
            });
        });
    };

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this.refs.dropdown);

        if (domNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.lastChild) {
            if (!domNode.contains(event.target) && !domNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.lastChild.contains(event.target)) {
                this.setState({
                    visible: false
                });
            }
        }

    }

    render() {

        var notificationData = (
            <Menu className='dropdown-notifications'>
                <Menu.Item>

                    <div className="card-container">
                        <Tabs type="card">
                            <TabPane tab="Company" key="1" className='notif-tabs'>

                                <div className='demo-infinite-container'>
                                    <InfiniteScroll
                                        initialLoad={false}
                                        pageStart={0}
                                        loadMore={this.handleInfiniteOnLoad}
                                        hasMore={!this.state.loading && this.state.hasMore}
                                        useWindow={false}
                                    >
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={this.state.unreadNotifications}
                                            className='notif-list'
                                            renderItem={item => (
                                                <div className='list-item-notif'>
                                                <List.Item className={item.read !== 1 ? 'notread-notif' : 'read-notif'} key={item.email} >
                                                    <div onClick={(e) => this.notificationClick(item.email, e)} style={{width: '100%'}}>
                                                    <List.Item.Meta
                                                        title={<a href="https://ant.design" target="_blank" onClick={(e) => this.notificationClick(item.email, e)}>{item.name.first.length > 20 ? item.name.first.substring(0, 20) + ' . . . ' : item.name.first.substring(0, 20)}</a>}
                                                        description={item.email.length > 40 ? item.email.substring(0, 40) + ' . . . ' : item.email.substring(0, 40)}
                                                        avatar={item.read !== 1 ? <Avatar type='flex' align='center' justify='center' src="https://colourlex.com/wp-content/uploads/2015/02/Red_lead_painted_swatch_Lipscher_225q-opt.jpg" style={{ width: '8px', height: '8px' }} size='large' /> : null}
                                                    />
                                                    </div>

                                                    <button

                                                        className='bookmark-notif-button'
                             
                                                        onClick={(e) => this.bookmarkNotification(item.email, e)}
                                                    >
                                                    <Icon
                                                        type="pushpin"
                                                        style={{ fontSize: '14px', padding: '8px', borderRadius: '15px' }} />
                                                    </button>

                                                    <button

                                                        className='close-notif-button'

                                                        onClick={(e) => this.clearNotification(item.email, e)}
                                                    >
                                                        <Icon
                                                            type="close"
                                                            style={{ fontSize: '14px', padding: '8px', borderRadius: '15px' }} />
                                                    </button>
                                                </List.Item>
                                                </div>
                                            )}
                                        >
                                            {this.state.loading && this.state.hasMore && (
                                                <div className="demo-loading-container">
                                                    <Spin />
                                                </div>
                                            )}
                                        </List>
                                    </InfiniteScroll>
                                </div>
                                {/* <button 
                                style={{backgroundColor: 'red', width: '100%', border: '0px, solid, black', borderRadius: '10px', color: 'white', borderWidth: '0px'}}
                                >
                                    Clear All
                                </button> */}

                            </TabPane>

                            <TabPane tab="Admin" key="2" className='notif-tabs'>
                                
                            </TabPane>

                            <TabPane tab="Bookmarks" key="3" className='notif-tabs'>
                                
                            <div className='demo-infinite-container'>
                                    <InfiniteScroll
                                        initialLoad={false}
                                        pageStart={0}
                                        loadMore={this.handleInfiniteOnLoad}
                                        hasMore={!this.state.loading && this.state.hasMore}
                                        useWindow={false}
                                    >
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={this.state.bookmarkNotifications}
                                            className='notif-list'
                                            renderItem={item => (
                                                <div className='list-item-notif'>
                                                <List.Item className={item.read !== 1 ? 'notread-notif' : 'read-notif'} key={item.email} >
                                                    <div onClick={(e) => this.notificationClick(item.email, e)} style={{width: '100%'}}>
                                                    <List.Item.Meta
                                                        title={<a href="https://ant.design" target="_blank" onClick={(e) => this.notificationClick(item.email, e)}>{item.name.first.length > 20 ? item.name.first.substring(0, 20) + ' . . . ' : item.name.first.substring(0, 20)}</a>}
                                                        description={item.email.length > 40 ? item.email.substring(0, 40) + ' . . . ' : item.email.substring(0, 40)}
                                                    />
                                                    </div>

                                                    <button

                                                        className='close-notif-button'
                                                        onClick={(e) => this.clearBookmarkNotification(item.email, e)}
                                                    >
                                                        <Icon
                                                            type="close"
                                                            style={{ fontSize: '14px', padding: '8px', borderRadius: '15px' }} />
                                                    </button>
                                                </List.Item>
                                                </div>
                                            )}
                                        >
                                            {this.state.loading && this.state.hasMore && (
                                                <div className="demo-loading-container">
                                                    <Spin />
                                                </div>
                                            )}
                                        </List>
                                    </InfiniteScroll>
                                </div>

                            </TabPane>
                        </Tabs>
                    </div>
                    
                </Menu.Item>
            </Menu>

        );

        console.log(this.state.unreadNotifications);

        return (

            <Dropdown
                overlay={notificationData}
                trigger={['click']}
                visible={this.state.visible}
                placement='bottomLeft'
                ref='dropdown'
                style={{ maxHeight: '500px' }}
            >
                <a className="ant-dropdown-link" href="#" onClick={this.toggleDropdown}>
                    <Icon type="bell" style={{ fontSize: '24px' }} />
                    <Badge
                        count={this.state.unreadNotifications.length - this.state.readNotif}
                        overflowCount={99}
                        offset={[-15, -20]}>
                    </Badge>
                </a>
            </Dropdown>
        )
    }
}

export default NotificationIcon;
