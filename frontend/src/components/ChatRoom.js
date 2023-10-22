import React, { useState } from 'react';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import MessageList from './chat/MessageList';
import SendMessageForm from './chat/SendMessageForm';

const ChatRoom = () => {
    const [dummyData, setDummyData] = useState(
        [
            {
                senderID: 'zanaqi',
                text: 'Hi'
            },
            {
                senderID: 'stereopliggy',
                text: 'hello'
            },
            {
                senderID: 'zanaqi',
                text: 'bye'
            },
            {
                senderID: 'stereopliggy',
                text: 'sayonara'
            },
        ]
    );

    const onSendMsg = (message) => {
        setDummyData(curr => [...curr, message])
    }

    return (
        <Grid container justifyContent={'center'} alignItems={'center'}>
            <MessageList chatData={dummyData} />
            <SendMessageForm onSendMsg={onSendMsg} />
        </Grid>
    )
}

export default ChatRoom;