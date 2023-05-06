import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from '../../baseURL';
import { fetchCategories } from './../../features/CategorySlice';

const EditProductModal = ({ open, handleOpen, handleClose, data, refetch }) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const [loader, setLoader] = useState(false);
	const [sizes_color, setSizes_color] = useState(data.sizes_color);
	const [ifColorAvailable, setIfColorAvailable] = useState(data?.ifColorAvailable || false);
	const [sizes, setSizes] = useState();

	const { categories } = useSelector((state) => state.categoriesReducer);
	const dispatch = useDispatch();
	// const [sizes_color, setSizes_color] = useState(true);

	// const handleChange = (event, newAlignment) => {
	// 	setSizes_color(newAlignment);
	// };

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	const date = format(new Date(), 'PPpp');

	const handleEditProduct = (d) => {
		const size = d?.size?.split(',');
		const colors = d?.color?.split(',');
		const product = {
			productsName: d.productName,
			picture: d.picture,
			oldPrice: d.originalPrice,
			newPrice: d.resellPrice,
			stockAmount: d.stockAmount,
			description: d.description,
			category: d.category,
			size: size,
			sizes_color: sizes_color,
			color: colors,
			ifColorAvailable: ifColorAvailable,
		};

		const productHistory = {
			productId: data._id,
			productsName: d.productName,
			picture: d.picture,
			oldPrice: data.newPrice,
			currentPrice: parseFloat(d.resellPrice),
			oldStockAmount: data.stockAmount,
			newStockAmount: parseFloat(d.stockAmount),
			categoryId: data.categoryId,
			newStockAdded: parseFloat(d.stockAmount) - data.stockAmount,
			updatedAt: date,
		};

		setLoader(true);
		fetch(`${baseUrl}/products/${data._id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(product),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.modifiedCount > 0) {
					fetch(`${baseUrl}/productHistory`, {
						method: 'POST',
						headers: {
							'content-type': 'application/json',
						},
						body: JSON.stringify(productHistory),
					})
						.then((res) => res.json())
						.then((data) => {
							toast.success('Product updated successfully');
							reset();
							refetch();
							setLoader(false);
							handleClose();
						});
				} else {
					setLoader(false);
					handleClose();
				}
			})
			.catch((err) => {
				console.log(err);
				setLoader(false);
				toast.error(err.message);
			});
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullScreen
			product={data}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<div className="flex justify-end pt-10 w-[70%] mx-auto">
				<DialogTitle id="alert-dialog-title">
					<Button onClick={handleClose} variant="outlined">
						Close
					</Button>
				</DialogTitle>
			</div>
			<DialogContent>
				<div className="">
					<div className="flex flex-col max-w-screen-lg mx-auto   p-6 rounded-md sm:p-10 bg-gray-900 text-gray-100">
						<form onSubmit={handleSubmit(handleEditProduct)} className="space-y-12 ">
							<div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
								<div className="col-span-full sm:col-span-3 mb-5">
									<label className="block mb-2 text-sm"> Name</label>
									<input
										type="text"
										defaultValue={data.productsName}
										{...register('productName', { required: 'Name  is required' })}
										className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
									/>
									{errors.productName && (
										<p className="text-red-600">{errors.productName?.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3 ">
									<label className="block mb-2 text-sm">Image</label>
									<input
										type="text"
										{...register('picture', { required: 'Picture is required' })}
										defaultValue={data.picture}
										className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
									/>
									{errors.picture && <p className="text-red-600">{errors.picture?.message}</p>}
								</div>

								<div className="col-span-full sm:col-span-2">
									<label className="block mb-2 text-sm">Original Price</label>
									<input
										type="number"
										{...register('originalPrice', {
											required: 'Original Price is required',
										})}
										defaultValue={data.oldPrice}
										className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
									/>
									{errors.originalPrice && (
										<p className="text-red-600">{errors.originalPrice?.message}</p>
									)}
								</div>

								<div className="col-span-full sm:col-span-2">
									<label className="block mb-2 text-sm">Resell Price</label>
									<input
										type="number"
										{...register('resellPrice', {
											required: 'Resell Price is required',
										})}
										defaultValue={data.newPrice}
										className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
									/>
									{errors.resellPrice && (
										<p className="text-red-600">{errors.resellPrice?.message}</p>
									)}
								</div>

								<div className="col-span-full sm:col-span-2">
									<label className="block mb-2 text-sm">Total Stock</label>
									<input
										type="number"
										{...register('stockAmount', { required: 'Stock amount is required' })}
										defaultValue={data.stockAmount}
										className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
									/>
									{errors.stockAmount && (
										<p className="text-red-600">{errors.originalPrice?.message}</p>
									)}
								</div>

								<div className="col-span-full sm:col-span-4 ">
									<label className="block mb-2 text-sm">Description</label>

									<textarea
										{...register('description', { required: 'Description is required' })}
										rows="5"
										defaultValue={data.description}
										className="textarea textarea-primary w-full  px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
									></textarea>
									{errors.description && (
										<p className="text-red-600">{errors.description?.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-2">
									<label className="block mb-2 text-sm">Categories</label>

									<select
										{...register('category', { required: 'Category must be selected' })}
										className="select select-primary w-full  px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
									>
										{categories.map((category) => {
											return (
												<>
													<option selected disabled hidden>
														{data.category}
													</option>
													<option key={category._id}>{category.categoryName}</option>
												</>
											);
										})}
									</select>
									{errors.category && <p className="text-red-600">{errors.category?.message}</p>}
								</div>
								<div className={`${sizes_color ? 'col-span-2' : 'col-span-full'}`}>
									<label className="block mb-2 text-sm">Sizes</label>

									<ToggleButtonGroup
										color="primary"
										value={sizes_color}
										exclusive
										// {...register('sizes_color', { required: 'Sizes_Color is required' })}
										// onChange={handleChange}
										aria-label="Platform"
									>
										<ToggleButton
											onClick={() => setSizes_color(true)}
											className="text-white"
											value={true}
										>
											True
										</ToggleButton>
										<ToggleButton
											onClick={() => setSizes_color(false)}
											className="text-white"
											value={false}
										>
											False
										</ToggleButton>
									</ToggleButtonGroup>
								</div>

								{sizes_color && (
									<div className="col-span-full sm:col-span-4">
										<label className="block mb-2 text-sm">Size</label>

										<input
											type="text"
											{...register('size', {
												required: 'Size is required',
											})}
											defaultValue={data?.size?.map((s) => s)}
											placeholder="lg,md,sm"
											className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
										/>
										{errors.size && <p className="text-red-600">{errors.size?.message}</p>}
									</div>
								)}

								{/* Color */}

								<div className={`${ifColorAvailable ? 'col-span-2' : 'col-span-full'}`}>
									<label className="block mb-2 text-sm">Colors</label>

									<ToggleButtonGroup
										color="secondary"
										value={ifColorAvailable}
										exclusive
										aria-label="Platform"
									>
										<ToggleButton onClick={() => setIfColorAvailable(true)} value={true}>
											True
										</ToggleButton>
										<ToggleButton
											onClick={() => setIfColorAvailable(false)}
											className="text-white"
											value={false}
										>
											False
										</ToggleButton>
									</ToggleButtonGroup>
								</div>
								{ifColorAvailable && (
									<div className="col-span-full sm:col-span-4">
										<label className="block mb-2 text-sm">Colors</label>

										<input
											type="text"
											{...register('color', {
												required: 'Color is required',
											})}
											defaultValue={data?.color?.map((c) => c)}
											placeholder="red,green,blue"
											className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
											onBlur={() => setSizes_color(true)}
										/>
										{errors.color && <p className="text-red-600">{errors.color?.message}</p>}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<div>
									<button
										type="submit"
										className="w-2/4 block mx-auto px-8 py-3 font-semibold rounded-md bg-yellow-500 text-white duration-500 "
									>
										{loader ? (
											<>
												<div className="flex items-center justify-center space-x-2">
													<div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
													<div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
													<div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
												</div>
											</>
										) : (
											<span>Update Product</span>
										)}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditProductModal;
