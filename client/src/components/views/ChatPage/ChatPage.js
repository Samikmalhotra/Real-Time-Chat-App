import React, { useEffect, useState } from 'react'
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
import {io} from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import  moment  from "moment";
import { getChats } from '../../../_actions/chat_actions';

const ChatPage = () => {

    const [chatMessage, setChatMessage] = useState("");
    const [socket,setSocket] = useState("");

    const dispatch = useDispatch();
    const user = useSelector(state => state.user)

    useEffect(() => {
        const s = io("http://localhost:5001");

        dispatch(getChats)

        s.on("message", (data) => {
            console.log(data);
        });

        return(()=>{
            s.disconnect()
        })
    },[])

    useEffect(() => {
        if(socket == null) {return};
        console.log(socket);
        
    } , [socket])

    const handleSearchChange =(e) => {
        setChatMessage(e.target.value)
    }

    const submitChatMessage = (e) => {
        e.preventDefault();

        let userId = user.userData._id
        let userName = user.userData.name;
        let userImage = user.userData.image;
        let nowTime = moment();
        let type = "Image";

        socket.emit("inputChatMessage",{
            chatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type
        });

        setChatMessage("");
    }

    return (
            <React.Fragment>
                <div>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}> Real Time Chat</p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="infinite-container">
                        {/* {this.props.chats && (
                            <div>{this.renderCards()}</div>
                        )} */}
                        <div
                            // ref={el => {
                            //     this.messagesEnd = el;
                            // }}
                            style={{ float: "left", clear: "both" }}
                        />
                    </div>

                    <Row >
                        <Form layout="inline" 
                        onSubmit={submitChatMessage}
                        >
                            <Col span={18}>
                                <Input
                                    id="message"
                                    prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Let's start talking"
                                    type="text"
                                    value={chatMessage}
                                    onChange={handleSearchChange}
                                />
                            </Col>
                            <Col span={2}>
                                
                            </Col>

                            <Col span={4}>
                                <Button type="primary" style={{ width: '100%' }} 
                                onClick={submitChatMessage} 
                                 htmlType="submit">
                                    <Icon type="enter" />
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                </div>
            </React.Fragment>
    )
}

export default ChatPage
