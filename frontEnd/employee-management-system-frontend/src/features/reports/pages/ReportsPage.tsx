import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ReportDownload from '../components/ReportDownload';

const ReportsPage: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Employee Reports
            </Typography>
            <Paper sx={{ p: 2 }}>
                <ReportDownload />
            </Paper>
        </Box>
    );
};

export default ReportsPage;
