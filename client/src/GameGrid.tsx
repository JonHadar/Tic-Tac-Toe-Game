import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Square from './Square';
import type { GameGridProps } from './types';

const ROWS = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

export default function GameGrid({ squares, onSquareClick }: GameGridProps) {
  return (
    <Box sx={{ p: 1, borderRadius: 2, boxShadow: 3 }}>
      <Stack>
        {ROWS.map(row => (
          <Stack direction="row" key={row[0]}>
            {row.map(i => (
              <Square
                key={i}
                value={squares[i]}
                label={`Square ${i + 1}`}
                onSquareClick={() => onSquareClick(i)}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
