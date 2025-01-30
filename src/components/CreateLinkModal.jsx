import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const CreateLinkModal = ({ open, onClose, onLinkCreated }) => {
    const [formData, setFormData] = useState({
        originalUrl: '',
        remarks: '',
        expirationDate: null
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            expirationDate: date
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/links', formData);
            onLinkCreated(data);
            toast.success('Link created successfully');
            handleClose();
        } catch (error) {
            toast.error('Error creating link');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            originalUrl: '',
            remarks: '',
            expirationDate: null
        });
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="create-link-dialog-title"
        >
            <DialogTitle id="create-link-dialog-title">Create New Link</DialogTitle>
            <DialogContent>
                <Box 
                    sx={{ 
                        mt: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2 
                    }}
                    component="form"
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        name="originalUrl"
                        label="Original URL"
                        value={formData.originalUrl}
                        onChange={handleChange}
                        fullWidth
                        required
                        autoFocus
                        inputProps={{
                            'aria-label': 'Original URL'
                        }}
                    />
                    <TextField
                        name="remarks"
                        label="Remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        fullWidth
                        inputProps={{
                            'aria-label': 'Remarks'
                        }}
                    />
                    <DateTimePicker
                        label="Expiration Date"
                        value={formData.expirationDate}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                fullWidth
                                inputProps={{
                                    ...params.inputProps,
                                    'aria-label': 'Expiration Date'
                                }}
                            />
                        )}
                        clearable
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    Create Link
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateLinkModal; 