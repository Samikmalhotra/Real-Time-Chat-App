import axios from 'axios';
import {
    GET_CHATS,
    AFTER_POST_MESSAGE
} from './types';
import { CHAT_SERVER } from '../components/Config.js';

export async function getChats(){
    const res = await axios.get(`${CHAT_SERVER}/getChats`)
    
    return {
        type: GET_CHATS,
        payload: res.data
    }
}

export function afterPostMessage(data){

    return {
        type: AFTER_POST_MESSAGE,
        payload: data
    }
}