import { DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

const OrderDetailsModal = ({ openModal, handleCloseModal, data }) => {
	// const handleClickOpen = () => {
	// 	setOpen(true);
	// };

	// const handleClose = () => {
	// 	setOpen(false);
	// };

	return (
		<Dialog
			open={openModal}
			onClose={handleCloseModal}
			maxWidth={'md'}
			fullWidth={'md'}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title" className="flex justify-end">
				<Button onClick={handleCloseModal}>Close</Button>
			</DialogTitle>

			<DialogContent>
				<DialogTitle id="alert-dialog-title" className="text-center">
					<p>First Name: {data.firstName}</p>
					<p>Last Name: {data.lastName}</p>
					<p>Email: {data.email}</p>
					<p>Mobile: {data.mobile}</p>
					<p>Address 1: {data.address1}</p>
					<p>Address 2: {data.address1}</p>
					<p>Country: {data.country}</p>
					<p>City: {data.city}</p>
					<p>State: {data.state}</p>
					<p>Order placed: {data.orderPlaced}</p>
					<p className="font-extrabold my-3 text-2xl">Total Price: ${data.totalPrice}</p>
					<div className="border-4 p-10 my-10 rounded-md">
						Cart Items
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y-2 mt-5 divide-gray-200 text-sm">
								<thead>
									<tr>
										<th className="whitespace-nowrap  font-medium text-gray-900">Picture</th>
										<th className="whitespace-nowrap  font-medium text-gray-900">Name</th>
										<th className="whitespace-nowrap  font-medium text-gray-900">Quantity</th>
										<th className="whitespace-nowrap  font-medium text-gray-900">Size</th>
										<th className="whitespace-nowrap  font-medium text-gray-900">Color</th>

										<th className="whitespace-nowrap  font-medium text-gray-900">Price</th>
									</tr>
								</thead>

								<tbody className="divide-y divide-gray-200">
									{data.cart.map((i) => {
										return (
											<tr key={i._id} className="odd:bg-gray-50">
												<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 flex justify-center">
													<img
														class="object-cover w-16 h-16 rounded-full ring  ring-gray-600"
														src={i.picture}
														alt=""
													/>
												</td>
												<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
													{i.productsName}
												</td>
												<td className="whitespace-nowrap px-4 py-2 text-gray-700">{i.quantity}</td>
												<td className="whitespace-nowrap px-4 py-2 text-gray-700">
													{i.sizeValue ? i.sizeValue : 'N/A'}
												</td>
												<td className="whitespace-nowrap px-4 py-2 text-gray-700">
													{i.colorValue ? i.colorValue : 'N/A'}
												</td>
												<td className="whitespace-nowrap px-4 py-2 text-gray-700">
													${i.newPrice * i.quantity}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</DialogTitle>
			</DialogContent>

			{/* <DialogActions>
					<Button onClick={handleCloseModal} autoFocus>
						Close
					</Button>
				</DialogActions> */}
		</Dialog>
	);
};

export default OrderDetailsModal;
