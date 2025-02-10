import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Construction, SentimentVeryDissatisfied } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ErrorPageProps {
  title?: string;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Oops! Page Under Construction",
  message = "We're working hard to bring you something amazing! 🚀",
}) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper
        sx={{
          p: 4,
          width: '100%',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Box sx={{ mb: 3 }}>
            <Construction sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
            <SentimentVeryDissatisfied sx={{ fontSize: 60, color: 'warning.main' }} />
          </Box>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {message}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              Go Back
            </Button>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Box
            component="img"
            src="https://illustrations.popsy.co/white/resistance-band.svg"
            alt="Under Construction"
            sx={{
              width: '100%',
              maxWidth: 400,
              mt: 4,
              opacity: 0.9,
            }}
          />
        </motion.div>
      </Paper>
    </Container>
  );
};

export default ErrorPage; 