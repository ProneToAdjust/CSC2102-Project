import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; 

const SendMessageForm = (props) => {
    const [msg, setMsg] = useState('');

    const handleMsgChange = (e) => {
        e.preventDefault();
        setMsg(e.target.value);
    }

    const handleSendMsg = (e) => {
        e.preventDefault();
        const msgData = {
            senderID: 'zanaqi',
            text: msg
        }
        props.onSendMsg(msgData);
        setMsg('');
    }

    return (
        <Grid container xs={12} justifyContent={'center'} alignItems={'center'} spacing={4}>
            <Grid xs={5}>
                <TextField fullWidth id="outlined-basic" label="Enter Message" variant="outlined" value={msg} onChange={handleMsgChange} />
            </Grid>
            <Grid xs={1}>
                <Button onClick={handleSendMsg} variant="contained">Send</Button>
            </Grid>
        </Grid>
    )
}

export default SendMessageForm;