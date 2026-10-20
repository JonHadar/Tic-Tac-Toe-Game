import { useState } from 'react';
import { Container, Stack, Typography, TextField, Button, Box } from '@mui/material';
import type { StartScreenProps } from './types';
import type React from 'react';

export default function StartScreen({onGameStart} : StartScreenProps) {

  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    if(player1 && player2) {
        onGameStart(player1, player2)
    }
  };

  return (
    <Container maxWidth="sm"> 

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
            
          <Typography variant='h3' component='h1' gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '2rem', sm: '3rem' } }}>
            Welcome To The "Tic Tac Toe" Game
          </Typography>

          <Box  // The form responsible for the players' input and handle the pressing on the start button
            component="form"
            onSubmit={handleStart}
            sx={{ width: '100%' }}
          >
            
            <Stack spacing={2}> 
                <TextField
                    label= "Player 1 (X)"
                    variant='outlined'
                    fullWidth
                    required
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                />

                <TextField
                    label= "Player 2 (O)"
                    variant='outlined'
                    fullWidth
                    required
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                />

                <Button // start game button
                    type='submit'
                    variant='contained'
                    size="large"
                    disabled={!player1 || !player2}
                >

                    Start The Game

                </Button>
            </Stack>
          </Box>
        </Box>
    </Container>
  )
}

