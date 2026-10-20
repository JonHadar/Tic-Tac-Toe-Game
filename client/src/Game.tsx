import { useState } from 'react';
import Board from './Board';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import StartScreen from './StartScreen';
import { calculateWinner } from './gameLogic';
import { reportWin } from './api';
import { useGlobalStats } from './useGlobalStats';
import type { Players, Squares, Stats } from './types';

export default function Game() {

  const [history, setHistory] = useState<Squares[]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [players, setPlayers] = useState<Players>({ player1: '', player2: '' });
  const [gameStarted, setGameStarted] = useState(false);

  const [sessionStats, setSessionStats] = useState<Stats>({ X: 0, O: 0 });
  const { stats: globalStats, refresh: refreshGlobalStats } = useGlobalStats();

  function handlePlay(nextSquares: Squares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // A win is counted only when the winning move is played, so jumping
    // back and forth through the move history never counts it twice.
    const winner = calculateWinner(nextSquares);
    if (winner) {
      setSessionStats(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      reportWin(winner)
        .then(refreshGlobalStats)
        .catch(error => console.error('Error reporting win:', error));
    }
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function handleGameStart(player1: string, player2: string) {
    setPlayers({ player1, player2 });
    setGameStarted(true);
  }

  const moves = history.map((_squares, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <ListItem key={move} disablePadding sx={{ py: 0.5 }}>
        <Button variant="contained" onClick={() => jumpTo(move)}>{description}</Button>
      </ListItem>
    );
  });

  return (

    !gameStarted ? (
      <StartScreen onGameStart={handleGameStart}/>
    ) : (

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Container>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="center"
            alignItems={{ xs: 'center', lg: 'flex-start' }}
            spacing={{ xs: 4, lg: 8 }}
          >

            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
              players={players}
              sessionStats={sessionStats}
              globalStats={globalStats}
            />

            <Stack alignItems={{ xs: 'center', lg: 'flex-start' }} sx={{ mt: { lg: '75px' } }}> {/* moves history list */}
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'red', whiteSpace: 'nowrap' }}>Moves History</Typography>
              <List>{moves}</List>
            </Stack>

          </Stack>
        </Container>
      </Box>
    )
  );
}
