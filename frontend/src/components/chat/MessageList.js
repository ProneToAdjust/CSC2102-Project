import React from 'react';
import { Button, Card, CardContent, CardHeader, Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; 
import * as mdb from 'mdb-ui-kit'; //

const MessageList = (props) => {
    
    return (
        <Grid container xs={6} spacing={2} paddingTop={'50px'} paddingBottom={'50px'}>
            <Card sx={{ width: '100%' }}>
                <CardHeader title={'Chat'} />
                <hr />
                <CardContent>
                        {props.chatData.map((message, index) => {
                            return (
                                <Grid xs={12}>
                                    <div>{message.senderID}</div>
                                    <div>{message.text}</div>
                                </Grid>
                            )
                        })}
                </CardContent>
            </Card>
        </Grid>
    )
}

export default MessageList;