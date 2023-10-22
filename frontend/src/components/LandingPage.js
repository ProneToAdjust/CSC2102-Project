import React from 'react';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const LandingPage = () => {
    return (
        <Grid container display="flex" justifyContent="center" alignItems="center" height="90vh">
            <Button variant="contained" href='/chat'>Start Chatting!</Button>
        </Grid>
    )
}

export default LandingPage;