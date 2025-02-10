import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
  Card,
  CardContent,
  Link,
  Snackbar,
  AlertColor,
} from '@mui/material';
import {
  Notifications,
  DarkMode,
  AttachMoney,
  Backup,
  CloudDownload,
  CloudUpload,
  GitHub,
  LinkedIn,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useBudgetStore from '../store/budgetStore';
import ErrorPage from '../components/ErrorPage';

const Settings = () => {
  const theme = useTheme();
  const { settings, updateSettings, exportData, importData } = useBudgetStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, severity: AlertColor = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zero-budget-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportOpen(false);
      showNotification('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export data', 'error');
    }
  };

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      importData(text);
      setImportOpen(false);
      showNotification('Data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      showNotification('Failed to import data', 'error');
    }
  };

  const handleBackupEnable = () => {
    if (!settings.backupEmail) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    showNotification('Automatic backups enabled!');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your preferences and account settings
        </Typography>
      </Box>

      {/* Profile Card */}
      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
              alt="Tyrone Samaroo"
            >
              TS
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                Tyrone Samaroo
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Full Stack Developer
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Link 
                  href="https://github.com/tyrone-samaroo" 
                  target="_blank" 
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <GitHub fontSize="small" />
                  GitHub
                </Link>
                <Link 
                  href="https://linkedin.com/in/tyrone-samaroo" 
                  target="_blank" 
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <LinkedIn fontSize="small" />
                  LinkedIn
                </Link>
              </Box>
            </Box>
          </Box>
          <Typography variant="body1">
            Passionate about creating efficient and user-friendly applications. Zero Budget is a personal project aimed at helping people manage their finances effectively.
          </Typography>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Paper sx={{ mb: 4 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="Notifications"
              secondary="Receive alerts about your budget and spending"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.notifications}
                onChange={(e) => updateSettings({ notifications: e.target.checked })}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary="Toggle dark/light theme"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={(e) => updateSettings({ darkMode: e.target.checked })}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Currency"
              secondary="Set your preferred currency"
            />
            <ListItemSecondaryAction>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                  <MenuItem value="CAD">CAD ($)</MenuItem>
                </Select>
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Data Management */}
      <Paper sx={{ mb: 4 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="Data Management"
              secondary="Export or import your budget data"
            />
            <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CloudDownload />}
                onClick={() => setExportOpen(true)}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => setImportOpen(true)}
              >
                Import
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Automatic Backups"
              secondary="Set up automatic data backups"
            />
            <ListItemSecondaryAction>
              <TextField
                size="small"
                placeholder="Backup email"
                value={settings.backupEmail || ''}
                onChange={(e) => updateSettings({ backupEmail: e.target.value })}
                sx={{ mr: 1 }}
              />
              <Button 
                variant="contained" 
                startIcon={<Backup />}
                onClick={handleBackupEnable}
                disabled={!settings.backupEmail}
              >
                Enable
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onClose={() => setExportOpen(false)}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography>
            This will download all your budget data as a JSON file.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportOpen(false)}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importOpen} onClose={() => setImportOpen(false)}>
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Select a previously exported JSON file to import your budget data.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This will replace all your current data. Make sure to backup your existing data first.
          </Alert>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!fileInputRef.current?.files?.length}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 