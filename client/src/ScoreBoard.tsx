import { Paper, Typography, Box } from '@mui/material';
import type { ScoreBoardProps } from './types';

export default function ScoreBoard({ title, xScore, oScore, color, textColor='red'}: ScoreBoardProps) {
    return (
        <Paper component="section" aria-label={title} elevation={3} sx={{ p: 2, m: 1, bgcolor: color, textAlign: 'center', minWidth: { xs: '140px', md: '200px' }, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', opacity: 0.8, color: textColor }}>
                {title}
            </Typography>

            <Box sx={{
                border: '2px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                p: 1.5
            }}>

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{fontWeight: 'bold'}}>X Player</Typography>
                    <Typography variant="h5" sx={{ fontWeight: '900', color: 'green' }}>
                        {xScore}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{fontWeight: 'bold'}}>O Player</Typography>
                    <Typography variant="h5" sx={{ fontWeight: '900', color: 'blue' }}>
                        {oScore}
                    </Typography>
                </Box>               
            </Box>
        </Paper>
    );
}