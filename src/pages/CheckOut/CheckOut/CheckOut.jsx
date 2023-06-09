import { format } from 'date-fns';
import React, { useContext, useState } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { emptyCart } from '../../../features/CartSlice';
import { baseUrl } from './../../../baseURL';
import { AuthContext } from './../../../Contexts/UserAuthProvider';

const CheckOut = () => {
	const { user } = useContext(AuthContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const dispatch = useDispatch();
	const [showShipping, setShowShipping] = useState(false);
	const cartItems = useSelector((state) => state.cartReducer.cartProducts);
	const [country, setCountry] = useState('Bangladesh');

	const [region, setRegion] = useState('Dhaka');

	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const date = format(new Date(), 'PPpp');
	const navigate = useNavigate()
	const latestCartItems = location.state;

	let total = 0;
	cartItems.map((item) => (total += item.quantity * item.newPrice));

	const emptyCartArray = () => {
		dispatch(emptyCart());
	};

	const handlePayment = (data) => {
		const { firstName, lastName, email, mobile, address1, address2, city, state, zip } = data;

		const order = {
			firstName,
			lastName,
			email,
			mobile,
			address1,
			address2,
			country: country,
			city,
			state: region,
			zip,
			cart: latestCartItems,
			orderPlaced: date,
			totalPrice: total,
		};

		const notificationMessage = {
			notificationMessage: `${firstName + ' ' + lastName} have placed an order`,
			sentTime: date,
		};

		setLoading(true);
		fetch(`${baseUrl}/orders`, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(order),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					fetch(`${baseUrl}/notifications`, {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(notificationMessage),
					})
						.then((res) => res.json())
						.then((data) => {
							toast.success('Order successful');
							setLoading(false);
							emptyCartArray();
							navigate('/')
						});
				}
			})
			.catch((err) => {
				toast.error(err.message);
				setLoading(false);
			});

		localStorage.removeItem('minion-commerce-cart');

		reset();
	};

	return (
		<form onSubmit={handleSubmit(handlePayment)} className="w-[90%] mx-auto">
			<div className="my-10">
				<nav className="w-full h-[48px] flex px-4 bg-white ">
					<ol className="flex  space-x-2 ">
						<li className="flex items-center space-x-1">
							<Link
								to={'/'}
								className="flex items-center px-1 text-[#1b1f22] capitalize hover:underline">
								Home
							</Link>
						</li>
						<li className="flex items-center space-x-1">
							<span className="dark:text-gray-400">/</span>
							<Link
								to={'/shop'}
								className="flex items-center px-1 text-[#1b1f22] capitalize hover:underline">
								Shop
							</Link>
						</li>
						<li className="flex items-center space-x-1">
							<span className="dark:text-gray-400">/</span>
							<Link className="flex items-center px-1 capitalize text-[#6c757d] cursor-default">
								Checkout
							</Link>
						</li>
					</ol>
				</nav>
			</div>

			<div className="my-10 flex flex-col lg:flex-row gap-10">
				<div className="lg:w-[65%] mb-20">
					<div className="flex items-center gap-2">
						<h1 className="uppercase text-xl font-semibold my-4">Billing Address</h1>
						<div className="flex flex-grow flex-wrap">
							<span className="w-full  border_style "></span>
						</div>
					</div>

					<div className="bg-white py-10 px-10">
						<div className=" grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
							<div>
								<label htmlFor="firstName" className="text-[#6c757d]">
									First Name
								</label>
								<input
									type="text"
									{...register('firstName', { required: 'First Name is required' })}
									placeholder="John"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.firstName && <p className="text-red-600">{errors.firstName?.message}</p>}
							</div>
							<div>
								<label htmlFor="lastName" className="text-[#6c757d]">
									Last Name
								</label>
								<input
									type="text"
									{...register('lastName', { required: 'Last Name is required' })}
									placeholder="Smith"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.lastName && <p className="text-red-600">{errors.lastName?.message}</p>}
							</div>
							<div>
								<label htmlFor="email" className="text-[#6c757d]">
									Email
								</label>
								<input
									type="text"
									{...register('email', {
										required: 'Email Address is required',
										pattern: {
											value: /.+@.+\..+/i,
											message: 'Please enter a valid email address',
										},
									})}
									defaultValue={user?.email}
									placeholder="example@example.com"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.email && <p className="text-red-600">{errors.email?.message}</p>}
							</div>
							<div>
								<label htmlFor="mobile" className="text-[#6c757d]">
									Mobile No
								</label>
								<input
									type="number"
									{...register('mobile', {
										required: 'Mobile Number is required',
									})}
									placeholder="+880 123456"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.mobile && <p className="text-red-600">{errors.mobile?.message}</p>}
							</div>
							<div>
								<label htmlFor="address1" className="text-[#6c757d]">
									Address Line 1
								</label>
								<input
									type="text"
									{...register('address1', {
										required: 'Address 1 is required',
									})}
									placeholder="123 street"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.address1 && <p className="text-red-600">{errors.address1?.message}</p>}
							</div>
							<div>
								<label htmlFor="address2" className="text-[#6c757d]">
									Address Line 2
								</label>
								<input
									type="text"
									{...register('address2', {
										required: 'Address 2 is required',
									})}
									placeholder="123 street"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.address2 && <p className="text-red-600">{errors.address2?.message}</p>}
							</div>

							<div>
								<label htmlFor="country" className="text-[#6c757d]">
									Country
								</label>

								<CountryDropdown
									classes="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									value={country}
									onChange={(val) => setCountry(val)}
									showDefaultOption={true}
								/>
								{/* {countryError && <p className="text-red-600">{countryError}</p>} */}
							</div>
							<div>
								<label htmlFor="city" className="text-[#6c757d]">
									City
								</label>
								<input
									type="text"
									{...register('city', {
										required: 'City is required',
									})}
									placeholder="New York"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.city && <p className="text-red-600">{errors.city?.message}</p>}
							</div>
							<div>
								<label htmlFor="state" className="text-[#6c757d]">
									State
								</label>

								<RegionDropdown
									classes="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									country={country}
									blankOptionLabel={'Select a country first'}
									value={region}
									onChange={(val) => setRegion(val)}
									showDefaultOption={true}
								/>
								{/* {regionError && <p className="text-red-600">{regionError}</p>} */}
							</div>
							<div>
								<label htmlFor="zip" className="text-[#6c757d]">
									ZIP
								</label>
								<input
									type="text"
									{...register('zip', {
										required: 'ZIP is required',
									})}
									placeholder="123"
									className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
								/>
								{errors.zip && <p className="text-red-600">{errors.zip?.message}</p>}
							</div>
						</div>
						<div className="mt-5 space-y-3">
							<div className="flex items-center">
								<input
									type="checkbox"
									className=" appearance-none text-[#ffd333] focus:ring-0 focus:ring-transparent"
								/>
								<p className="ml-2">Create an account</p>
							</div>
							<div className="flex items-center">
								<input
									type="checkbox"
									onClick={() => setShowShipping(!showShipping)}
									className=" appearance-none text-[#ffd333] focus:ring-0 focus:ring-transparent"
								/>
								<p className="ml-2">Ship to different address</p>
							</div>
						</div>
					</div>

					{/* <div className={`${showShipping ? 'text-box' : 'form-inactive'}`}>
						<div className={`flex items-center gap-2 mt-10 `}>
							<h1 className="uppercase text-xl font-semibold my-4">Shipping Address</h1>
							<div className="flex flex-grow flex-wrap">
								<span className="w-full  border_style "></span>
							</div>
						</div>
						<div className="bg-white py-10 px-10">
							<form className=" grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
								<div>
									<label htmlFor="firstName1" className="text-[#6c757d]">
										First Name
									</label>
									<input
										type="text"
										{...register('firstName1', { required: 'First Name is required' })}
										placeholder="John"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.firstName1 && (
										<p className="text-red-600">{errors.firstName1?.message}</p>
									)}
								</div>
								<div>
									<label htmlFor="lastName1" className="text-[#6c757d]">
										Last Name
									</label>
									<input
										type="text"
										{...register('lastName1', { required: 'Last Name is required' })}
										placeholder="Smith"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.lastName1 && <p className="text-red-600">{errors.lastName1?.message}</p>}
								</div>
								<div>
									<label htmlFor="email1" className="text-[#6c757d]">
										Email
									</label>
									<input
										type="text"
										{...register('email1', {
											required: 'Email Address is required',
											pattern: {
												value: /.+@.+\..+/i,
												message: 'Please enter a valid email address',
											},
										})}
										placeholder="example@example.com"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.email1 && <p className="text-red-600">{errors.email1?.message}</p>}
								</div>
								<div>
									<label htmlFor="mobile1" className="text-[#6c757d]">
										Mobile No
									</label>
									<input
										type="text"
										{...register('mobile1', {
											required: 'Mobile Number is required',
										})}
										placeholder="+880 123456"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.mobile1 && <p className="text-red-600">{errors.mobile1?.message}</p>}
								</div>
								<div>
									<label htmlFor="address1Ship" className="text-[#6c757d]">
										Address Line 1
									</label>
									<input
										type="text"
										{...register('address1Ship', {
											required: 'Address 1 is required',
										})}
										placeholder="123 street"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.address1Ship && (
										<p className="text-red-600">{errors.address1Ship?.message}</p>
									)}
								</div>
								<div>
									<label htmlFor="address2Ship" className="text-[#6c757d]">
										Address Line 2
									</label>
									<input
										type="text"
										{...register('address2Ship', {
											required: 'Address 2 is required',
										})}
										placeholder="123 street"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.address2Ship && (
										<p className="text-red-600">{errors.address2Ship?.message}</p>
									)}
								</div>

								<div>
									<label htmlFor="country1" className="text-[#6c757d]">
										Country
									</label>
									<select
										{...register('country1', {
											required: 'Country is required',
										})}
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 ">
										<option selected value="United States">
											United States
										</option>
										<option value="Albania">Albania</option>
										<option value="Oman">Oman</option>
										<option value="UAE">UAE</option>
									</select>
									{errors.country1 && <p className="text-red-600">{errors.country1?.message}</p>}
								</div>
								<div>
									<label htmlFor="city1" className="text-[#6c757d]">
										City
									</label>
									<input
										type="text"
										{...register('city1', {
											required: 'City is required',
										})}
										placeholder="New York"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.city1 && <p className="text-red-600">{errors.city1?.message}</p>}
								</div>
								<div>
									<label htmlFor="state1" className="text-[#6c757d]">
										State
									</label>
									<input
										type="text"
										{...register('state1', {
											required: 'State is required',
										})}
										placeholder="New York"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.state1 && <p className="text-red-600">{errors.state1?.message}</p>}
								</div>
								<div>
									<label htmlFor="zip" className="text-[#6c757d]">
										ZIP
									</label>
									<input
										type="text"
										{...register('zip1', {
											required: 'ZIP is required',
										})}
										placeholder="123"
										className="w-full focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#6a7075]  border-[#D4D9DF] mt-2 "
									/>
									{errors.zip1 && <p className="text-red-600">{errors.zip1?.message}</p>}
								</div>
							</form>
						</div>
					</div> */}
				</div>

				<div className="lg:w-[35%]">
					<div>
						<div className="flex items-center gap-2">
							<h1 className="uppercase text-xl font-semibold my-4 text-[#3d464d]">Order Total</h1>
							<div className="flex flex-grow flex-wrap">
								<span className="w-full  border_style "></span>
							</div>
						</div>

						<div className="bg-white py-10 px-5 space-y-5 text-[#3d464d] font-semibold">
							<div className="flex justify-between">
								<h1 className="text-lg font-medium">Products</h1>
							</div>
							{cartItems.map((item) => (
								<div key={item._id} className="flex justify-between text-[#6c757d] text-lg">
									<div className="flex gap-2 items-center">
										<h1>{item.productsName}</h1>
										<h1>* {item.quantity}</h1>
									</div>
									<p>${item.newPrice * item.quantity}</p>
								</div>
							))}

							<hr />

							<div className="space-y-5 text-lg text-black">
								<div className="flex justify-between">
									<h1>Subtotal</h1>
									<p>
										$<span>{total}</span>
									</p>
								</div>
								<div className="flex justify-between">
									<h1>Shipping</h1>
									<p>$10</p>
								</div>
							</div>

							<hr />

							<div className="flex justify-between text-xl">
								<h1>Total</h1>
								<p>
									{' '}
									<span>$</span> {total + 10}
								</p>
							</div>
						</div>
					</div>

					<div className="mt-10 ">
						<div className="flex items-center gap-2">
							<h1 className="uppercase text-xl font-semibold my-4 text-[#3d464d]">Payment</h1>
							<div className="flex flex-grow flex-wrap">
								<span className="w-full  border_style "></span>
							</div>
						</div>

						<div className="mt-5 space-y-3 bg-white p-10 text-[#6c757d] text-lg">
							<div className="flex items-center">
								<input
									type="radio"
									name="payment"
									className=" appearance-none text-[#ffd333] focus:ring-0 focus:ring-transparent"
								/>
								<label htmlFor="payment-option-1" className="ml-2">
									Paypal
								</label>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									name="payment"
									className=" appearance-none text-[#ffd333] focus:ring-0 focus:ring-transparent"
								/>
								<label htmlFor="payment-option-2" className="ml-2">
									Direct Check
								</label>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									name="payment"
									className=" appearance-none text-[#ffd333] focus:ring-0 focus:ring-transparent"
								/>
								<label htmlFor="payment-option-3" className="ml-2">
									Bank Transfer
								</label>
							</div>
							<div>
								<button
									type="submit"
									onClick={handleSubmit(handlePayment)}
									className="bg-[#FFD333] text-black hover:bg-[#FFCB0D] duration-500 py-3 px-7 w-full mt-4">
									{loading ? (
										<div className="w-6 h-6 mx-auto border-4 border-dashed rounded-full animate-spin border-purple-800"></div>
									) : (
										<span>Proceed To Checkout</span>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

export default CheckOut;
