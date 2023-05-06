import Dialog from '@mui/material/Dialog';
import React from 'react';
import AddProducts from './../../pages/Dashboard/AddProducts/AddProducts';

const AddProductModal = ({ open, close, refetch }) => {
	return (
		<Dialog
			fullScreen
			open={open}
			onClose={close}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<AddProducts open={open} close={close} refetch={refetch} />
		</Dialog>
	);
};

export default AddProductModal;
