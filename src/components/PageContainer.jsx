import { Box } from '@mui/material';

const PageContainer = ({ children }) => {
    return (
        <Box
            sx={{
                p: 3,
                height: '100%',
                backgroundColor: '#f5f5f5',
                overflowX: 'hidden',
                width: '100%'
            }}
        >
            {children}
        </Box>
    );
};

export default PageContainer; 