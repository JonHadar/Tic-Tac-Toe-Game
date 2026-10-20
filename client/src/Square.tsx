import type { SquareProps } from './types';
import Button from '@mui/material/Button';

function Square({ value, label, onSquareClick }: SquareProps) {
  return (

    <Button
      onClick={onSquareClick}
      aria-label={value ? `${label}: ${value}` : label}
      sx={{
        width: { xs: 90, sm: 120, md: 150 },
        height: { xs: 90, sm: 120, md: 150 },
        fontSize: { xs: '4.5rem', sm: '6rem', md: '8rem' },
        fontWeight: 'bold',
        backgroundColor: 'wheat',
        border: '3px solid black',
        borderRadius: '15px',
        transition: 'all 0.2s ease',

        color: value === 'X' ? 'green' : (value === 'O' ? 'blue' : 'black'),

        minWidth: 'auto',
        padding: 0,

        '&:hover': {
          backgroundColor: '#b3e5fc',
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(0.95)'
        }
      }} 
    >

      {value}

    </Button>
  );
}

export default Square;