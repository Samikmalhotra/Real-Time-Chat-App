import React, { useEffect, useState, useCallback } from 'react'
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
import {io} from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import  moment  from "moment";
import { afterPostMessage, getChats } from '../../../_actions/chat_actions';
import ChatCard from './ChatCard';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const ChatPage = () => {

    const [chatMessage, setChatMessage] = useState("");
    const [socket,setSocket] = useState("");

    const dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const chat = useSelector(state => state.chat)

    useEffect(() => {
        const s = io("http://localhost:5001");
        setSocket(s);
        dispatch(getChats())

        s.on("message", (data) => {
            console.log(data);
            dispatch(afterPostMessage(data));
        });

        return(()=>{
            s.disconnect()
        })
    },[])

    const onDrop = async(files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        const res = await axios.post("/api/upload", formData, config);
    }

    const messageEndRef = useCallback((messageEnd) => {
        if(messageEnd === null) return;
        messageEnd.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        console.log(messageEnd);
    },[])

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
                    <div className="infinite-container" style={{height: '425px', overflowY:'scroll'}}>
                        {chat.chats && (
                            <div>{chat.chats && chat.chats.map((chat) => {
                                return (<ChatCard key={chat._id} {...chat}/>)
                            })}</div>
                        )}
                        <div
                            ref={messageEndRef}
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
                            <Dropzone onDrop={onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <Button>
                                                    <Icon type="upload" />
                                                </Button>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
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
