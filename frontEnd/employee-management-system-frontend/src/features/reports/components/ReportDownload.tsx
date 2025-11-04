import React, { useState } from 'react';
import { Button, Alert, Box, Typography } from '@mui/material';
import { reportsApi } from '../../../api/reportsApi';

const ReportDownload: React.FC = () => {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setError('');
        setIsLoading(true);

        try {
            const blob = await reportsApi.downloadReport();
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            
            // Set the filename for the download
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `employee-report-${currentDate}.pdf`;
            link.setAttribute('download', fileName);
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to download report. Please try again.');
            console.error('Error downloading report:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Download Employee Report
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Button 
                onClick={handleDownload}
                variant="contained"
                disabled={isLoading}
            >
                {isLoading ? 'Downloading...' : 'Download Report'}
            </Button>
        </Box>
    );
};

export default ReportDownload;
