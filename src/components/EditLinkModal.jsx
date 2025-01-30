import React, { useState, useEffect } from 'react';
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

const EditLinkModal = ({ open, onClose, link, onSubmit }) => {
    const [formData, setFormData] = useState({
        originalUrl: '',
        remarks: '',
        expirationDate: null
    });

    useEffect(() => {
        if (link) {
            setFormData({
                originalUrl: link.originalUrl || '',
                remarks: link.remarks || '',
                expirationDate: link.expirationDate ? new Date(link.expirationDate) : null
            });
        }
    }, [link]);

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

    const handleSubmit = () => {
        onSubmit({
            ...link,
            ...formData
        });
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            aria-labelledby="edit-link-dialog-title"
            keepMounted={false}
            disableEscapeKeyDown={false}
            disablePortal={false}
        >
            <DialogTitle id="edit-link-dialog-title">Edit Link</DialogTitle>
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
                    onClick={onClose}
                    tabIndex={0}
                    aria-label="Cancel"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="primary"
                    tabIndex={0}
                    aria-label="Save Changes"
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditLinkModal; 