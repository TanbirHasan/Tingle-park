import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { format } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../baseURL';
import { fetchCategories } from '../../../features/CategorySlice';
import { AuthContext } from './../../../Contexts/UserAuthProvider';

const AddProducts = ({ open, close, refetch }) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const { categories } = useSelector((state) => state.categoriesReducer);

	const dispatch = useDispatch();
	const [sizes_color, setSizes_color] = useState(false);
	const [ifColorAvailable, setIfColorAvailable] = useState(false);
	const [loader, setLoader] = useState(false);
	const date = format(new Date(), 'PPpp');

	// const handleChange = (event, newAlignment) => {
	// 	setSizes_color(newAlignment);
	// };

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	const handleAddProduct = (data) => {
		const category = categories.find((category) => category.categoryName === data.category);

		const categoryId = category._id;

		// const formData = new FormData();
		// for (let i = 0; i < data.images.length; i++) {
		//   formData.append("images", data.images[i]);
		// }
		// formData.append("productsName", data.productName);

		// formData.append("oldPrice", data.originalPrice);
		// formData.append("newPrice", data.resellPrice);
		// formData.append("stockAmount", data.stockAmount);
		// formData.append("userName", user?.displayName);
		// formData.append("description", data.description);
		// formData.append("category", data.category);
		// formData.append("categoryId", categoryId);
		// formData.append("createdAt", date);

		const sizes = data?.size?.split(',');
		const colors = data?.color?.split(',');

		const product = {
			productsName: data.productName,
			picture: data.picture,
			oldPrice: data.originalPrice,
			newPrice: data.resellPrice,
			stockAmount: data.stockAmount,
			userName: user?.displayName,
			description: data.description,
			category: data.category,
			categoryId: categoryId,
			createdAt: date,
			size: sizes,
			sizes_color: sizes_color,
			color: colors,
			ifColorAvailable: ifColorAvailable
		};

		setLoader(true);
		fetch(`${baseUrl}/products/addProduct`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
			},
			body: JSON.stringify(product),
		})
			.then((res) => res.json())
			.then((data) => {
				toast.success('Product added successfully');
				close();
				setLoader(false);

				refetch();
			})
			.catch((error) => {
				setLoader(false);
				console.error(error);
			});
	};

	return (
		<div className="w-full md:w-[1000px] md:mx-auto">
			<div className="flex justify-end my-5">
				<Button variant="outlined" onClick={close}>
					Close
				</Button>
			</div>
			<div className="mt-10">
				<div className="flex flex-col justify-center p-6 rounded-md sm:p-10 bg-gray-900 text-gray-100">
					<form onSubmit={handleSubmit(handleAddProduct)} className="space-y-12 ">
						<div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
							<div className="col-span-full sm:col-span-3 mb-5">
								<label className="block mb-2 text-sm">Name</label>
								<input
									placeholder="Name"
									type="text"
									{...register('productName', {
										required: 'Name  is required',
									})}
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
									placeholder="Image"
									className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
								/>
								{errors.picture && <p className="text-red-600">{errors.picture?.message}</p>}
							</div>
							{/* <div className="col-span-full sm:col-span-3 ">
								<label>Product Images:</label>
								<input type="file" {...register('images', { required: true })} multiple />
								{errors.images && <span>This field is required</span>}
							</div> */}

							<div className="col-span-full sm:col-span-2">
								<label className="block mb-2 text-sm">Original Price</label>
								<input
									type="number"
									{...register('originalPrice', {
										required: 'Original Price is required',
									})}
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
									{...register('stockAmount', {
										required: 'Stock amount is required',
									})}
									className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
								/>
								{errors.stockAmount && (
									<p className="text-red-600">{errors.originalPrice?.message}</p>
								)}
							</div>

							<div className="col-span-full sm:col-span-3">
								<label className="block mb-2 text-sm">Description</label>

								<textarea
									{...register('description', {
										required: 'Description is required',
									})}
									className="textarea textarea-primary w-full  px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"></textarea>
								{errors.description && (
									<p className="text-red-600">{errors.description?.message}</p>
								)}
							</div>
							<div className="col-span-full sm:col-span-3">
								<label className="block mb-2 text-sm">Categories</label>

								<select
									defaultValue={'Choose category...'}
									{...register('category', {
										required: 'Category must be selected',
									})}
									className="select select-primary w-full  px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100">
									<option value="Choose category..." disabled hidden>
										Choose category...
									</option>
									{categories.map((category) => {
										return (
											<>
												<option key={category._id} value={category.categoryName}>
													{category.categoryName}
												</option>
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
									aria-label="Platform">
									<ToggleButton
										onClick={() => setSizes_color(true)}
										className="text-white"
										value={true}>
										True
									</ToggleButton>
									<ToggleButton
										onClick={() => setSizes_color(false)}
										className="text-white"
										value={false}>
										False
									</ToggleButton>
								</ToggleButtonGroup>
							</div>

							{sizes_color && (
								<div className="col-span-full sm:col-span-4">
									<label className="block mb-2 text-sm">Sizes</label>

									<input
										type="text"
										{...register('size', {
											required: 'Size is required',
										})}
										placeholder="lg,md,sm"
										className="w-full input-primary px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
										onBlur={() => setSizes_color(true)}
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
									aria-label="Platform">
									<ToggleButton onClick={() => setIfColorAvailable(true)} value={true}>
										True
									</ToggleButton>
									<ToggleButton
										onClick={() => setIfColorAvailable(false)}
										className="text-white"
										value={false}>
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
									className="w-2/4 block mx-auto px-8 py-3 font-semibold rounded-md bg-yellow-500 text-white duration-500 ">
									{loader ? (
										<>
											<div className="flex items-center justify-center space-x-2">
												<div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
												<div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
												<div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
											</div>
										</>
									) : (
										<span>Add Product</span>
									)}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddProducts;
