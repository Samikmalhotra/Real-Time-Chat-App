import React, { useState } from 'react'
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
const ChatPage = () => {

    const [chatMessage, setChatMessage] = useState("");

    const handleSearchChange =(e) => {
        setChatMessage(e.target.value)
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
                        // onSubmit={submitChatMessage}
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
                                // onClick={submitChatMessage} 
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
