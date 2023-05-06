import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { IconButton, Tooltip, tooltipClasses, Zoom } from '@mui/material';
import Button from '@mui/material/Button';
import { orange } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { baseUrl } from '../../../baseURL';
import AddProductModal from '../../../components/AddProductModal/AddProductModal';
import EditProductModal from '../../../components/EditProductModal/EditProductModal';
import ProductHistoryModal from '../../../components/ProductHistoryModal/ProductHistoryModal';
import ViewProductModal from './../../../components/ViewProductModal/ViewProductModal';

const DarkTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: theme.palette.common.black,
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.black,
	},
}));

const AllProducts = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const pages = Math.ceil(count / size);
	const [openModal, setOpenModal] = React.useState(false);
	const [openProductHistoryModal, setOpenProductHistoryModal] = useState(false);
	const [addProductModal, setAddProductModal] = useState(false);
	const [viewProductModal, setViewProductModal] = useState(false);
	const [productModalData, setProductModalData] = useState({});
	const [modalData, setModalData] = useState({});
	const [dialogData, setDialogData] = useState({});
	const [productHistoryData, setProductHistoryData] = useState({});

	const { data: products = [], refetch, isLoading, isPreviousData } = useQuery({
		queryKey: ['allProducts', page, size],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/products/paginated-products?page=${page}&size=${size}`);
			const result = await res.json();
			const data = result.products;
			setCount(result.count);
			return data;
		},
		keepPreviousData: true,
	});

	const handleOpenModal = (product) => {
		setOpenModal(true);
		setModalData(product);
	};
	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleOpenDialog = (product) => {
		setOpenDialog(true);
		setDialogData(product);
	};
	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleDeleteProduct = (product) => {
		fetch(`${baseUrl}/products/${product._id}`, {
			method: 'DELETE',
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					toast.success(`${product.productsName} deleted successfully`);
					refetch();
					setOpenDialog(false);
				}
			});
	};

	const handleClickOpenAddProductModal = () => {
		setAddProductModal(true);
	};

	const handleCloseAddProductModal = () => {
		setAddProductModal(false);
	};

	const handleOpenViewProductModal = (product) => {
		setViewProductModal(true);
		setProductModalData(product);
	};

	const handleCloseViewProductModal = () => {
		setViewProductModal(false);
	};

	const handleClickOpenProductHistoryModal = (product) => {
		setOpenProductHistoryModal(true);
		setProductHistoryData(product);
	};

	const handleCloseProductHistoryModal = () => {
		setOpenProductHistoryModal(false);
	};

	return (
		<div>
			<div className="py-1 bg-gray-50">
				<div className="w-full xl:max-w-5xl mb-12 xl:mb-0 px-4 mx-auto mt-10">
					<div className="flex justify-end my-5">
						<Button
							variant="contained"
							endIcon={<AddIcon />}
							onClick={handleClickOpenAddProductModal}
						>
							Add Product
						</Button>
					</div>
					<div className="relative flex flex-col min-w-0  bg-white w-full mb-6 shadow-xl rounded">
						<div class="rounded-t mb-0 px-4 py-3 border-0">
							<div class="flex flex-wrap items-center justify-center">
								<div class="relative w-full px-4 max-w-full flex-grow flex-1">
									<h3 class="font-semibold text-base text-md text-center">All Products</h3>
								</div>
							</div>
						</div>
						<div className="block w-full overflow-x-auto">
							<div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
								{isLoading ? (
									<div className="flex h-screen justify-center items-center">
										<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
									</div>
								) : (
									''
								)}

								<table className="items-center bg-transparent w-full border-collapse">
									<thead>
										<tr className="bg-gray-200">
											<th
												scope="col"
												className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold"
											>
												Serial Number
											</th>
											<th
												scope="col"
												className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold"
											>
												Image
											</th>
											<th
												scope="col"
												className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold"
											>
												Category
											</th>
											<th
												scope="col"
												className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold"
											>
												Product
											</th>
											<th
												scope="col"
												className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold"
											>
												Selling Price
											</th>

											<th
												scope="col"
												className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold"
											>
												Actions
											</th>
										</tr>
									</thead>

									<tbody>
										{products.map((product, i) => (
											<tr key={product._id}>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
													<div>{i + 1}</div>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
													<div className="flex items-center">
														<div>
															<img
																alt="product"
																src={product.picture}
																className="mx-auto object-cover rounded-full h-12 w-12 "
															/>
														</div>
													</div>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
													<div>{product.category}</div>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
													<div>{product.productsName}</div>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
													<div>${product.newPrice}</div>
												</td>

												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center flex gap-5  justify-center">
													<DarkTooltip TransitionComponent={Zoom} arrow title={'View Details'}>
														<IconButton
															onClick={() => handleOpenViewProductModal(product)}
															type="button"
															color="orange"
															aria-label="view"
														>
															<RemoveRedEyeOutlinedIcon sx={{ color: orange[200] }} />
														</IconButton>
													</DarkTooltip>

													<DarkTooltip
														TransitionComponent={Zoom}
														arrow
														title={'View Product History'}
													>
														<IconButton
															onClick={() => handleClickOpenProductHistoryModal(product)}
															type="button"
															color="orange"
															aria-label="history"
														>
															<HistoryIcon />
														</IconButton>
													</DarkTooltip>

													<DarkTooltip TransitionComponent={Zoom} arrow title={'Edit Product'}>
														<IconButton
															onClick={() => handleOpenModal(product)}
															type="button"
															color="primary"
															aria-label="edit"
														>
															<EditIcon />
														</IconButton>
													</DarkTooltip>

													<DarkTooltip TransitionComponent={Zoom} arrow title={'Delete Product'}>
														<IconButton
															onClick={() => handleOpenDialog(product)}
															type="button"
															color="error"
															aria-label="delete"
														>
															<DeleteIcon />
														</IconButton>
													</DarkTooltip>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								<div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
									<div className="flex items-center justify-center">
										<button
											onClick={() => {
												setPage((old) => Math.max(old - 1, 0));
											}}
											disabled={page === 0}
											className="w-full p-4 text-base text-gray-600 bg-white border
										rounded-l-xl hover:bg-gray-100"
										>
											<svg
												width="9"
												fill="currentColor"
												height="8"
												className=""
												viewBox="0 0 1792 1792"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
											</svg>
										</button>
										<>
											{[...Array(pages).keys()].map((number) => (
												<button
													key={number}
													className={`w-full px-4 py-2 text-base text-indigo-500 bg-white border-t border-b hover:bg-gray-100 ${
														page === number ? ' font-extrabold text-xl border' : ''
													}`}
													onClick={() => {
														setPage(number);
														refetch();
													}}
												>
													{number + 1}
												</button>
											))}
										</>

										<button
											onClick={() => {
												setPage((old) => old + 1);
											}}
											// Disable the Next Page button until we know a next page is available
											disabled={isPreviousData}
											className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
										>
											<svg
												width="9"
												fill="currentColor"
												height="8"
												className=""
												viewBox="0 0 1792 1792"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<>
				{openModal ? (
					<EditProductModal
						open={openModal}
						handleOpen={handleOpenModal}
						data={modalData}
						handleClose={handleCloseModal}
						refetch={refetch}
					/>
				) : null}
			</>

			<>
				{openDialog ? (
					<Dialog
						open={openDialog}
						product={dialogData}
						onClose={handleCloseDialog}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							{`Are you sure you want to delete`}
							<span className="font-extrabold"> {dialogData.productsName} ?</span>
						</DialogTitle>

						<DialogActions>
							<Button onClick={handleCloseDialog}>Disagree</Button>
							<Button
								startIcon={<DeleteIcon />}
								color="error"
								onClick={() => handleDeleteProduct(dialogData)}
								autoFocus
							>
								Delete
							</Button>
						</DialogActions>
					</Dialog>
				) : null}
			</>

			<>
				{addProductModal ? (
					<AddProductModal
						open={addProductModal}
						refetch={refetch}
						close={handleCloseAddProductModal}
					/>
				) : null}
			</>

			<>
				{viewProductModal ? (
					<ViewProductModal
						open={viewProductModal}
						close={handleCloseViewProductModal}
						data={productModalData}
					/>
				) : null}
			</>

			<>
				{openProductHistoryModal ? (
					<ProductHistoryModal
						open={openProductHistoryModal}
						handleClose={handleCloseProductHistoryModal}
						data={productHistoryData}
					/>
				) : null}
			</>
		</div>
	);
};

export default AllProducts;
