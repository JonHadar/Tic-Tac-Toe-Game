import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { BoardProps } from './types';
import { calculateWinner, isDraw } from './gameLogic';

import StatsPanel from './StatsPanel';
import GameGrid from './GameGrid';

const StatusHeader = styled(Typography)({
  color: 'red',
  fontWeight: 'bold',
  marginBottom: '8px',
  minHeight: '40px',
  textAlign: 'center',
});

export default function Board({ xIsNext, squares, onPlay, players, sessionStats, globalStats }: BoardProps) {
  const winner = calculateWinner(squares);

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = 'Winner: ' + (winner === 'X' ? players.player1 : players.player2);
  } else if (isDraw(squares)) {
    status = "It's a draw!";
  } else {
    status = 'Next Player: ' + (xIsNext ? players.player1 : players.player2);
  }

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        justifyContent: 'center',
        alignItems: { xs: 'center', md: 'flex-start' },
        gap: { xs: 4, md: 8 }
    }}>

      <StatsPanel
        sessionStats={sessionStats}
        globalStats={globalStats}
      />

      <Stack alignItems="center" spacing={2}>

        <StatusHeader variant="h4" role="status">
          {status}
        </StatusHeader>

        <GameGrid
          squares={squares}
          onSquareClick={handleClick}
        />

      </Stack>
    </Box>
  );
}
