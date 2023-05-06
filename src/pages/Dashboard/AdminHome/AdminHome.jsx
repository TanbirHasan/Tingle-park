import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AiFillCaretUp } from 'react-icons/ai';
import { FaRegMoneyBillAlt, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { MdInventory2 } from 'react-icons/md';
import { TbMessages } from 'react-icons/tb';
import { PropagateLoader } from 'react-spinners';
import { baseUrl } from '../../../baseURL';
import OrderCharts from '../../../components/OrderCharts/OrderCharts';

const AdminHome = () => {
	const [productsCount, setProductsCount] = useState(0);
	const [ordersCount, setOrdersCount] = useState(0);
	const [totalContactMessage, setTotalContactMessage] = useState(0);
	const [totalUsers, setTotalUsers] = useState(0);

	const { data: orderPrices = [], refetch, isLoading } = useQuery({
		queryKey: ['orderPrices'],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/orders/order/totalPrice`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
				},
			});
			const result = await res.json();
			setProductsCount(result.productsLength);
			setOrdersCount(result.ordersCount);
			setTotalContactMessage(result.totalContactMessage);
			setTotalUsers(result.totalUsers);
			return result.totalPrice;
		},
	});

	let prices = orderPrices.map((p) => p.totalPrice);
	const sum = prices.reduce((x, y) => x + y, 0);

	return (
		<>
			{isLoading ? (
				<div className="flex h-screen justify-center items-center">
					<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
				</div>
			) : (
				<div>
					<section className="h-full lg:ml-20">
						<div className="mx-auto max-w-screen-xl ">
							<div className="flex flex-wrap">
								{/* Card - 1 */}
								<div className="w-full md:w-1/2 xl:w-1/3 p-6">
									<div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5">
										<div className="flex flex-row items-center">
											<div className="flex-shrink pr-4">
												<div className="rounded-full p-5 bg-green-600">
													<FaRegMoneyBillAlt className="text-[32px] text-white font-extrabold" />
												</div>
											</div>
											<div className="flex-1 text-right md:text-center">
												<h2 className="font-bold uppercase text-gray-600">Total Revenue</h2>
												<p className="font-bold text-3xl flex justify-end lg:justify-center items-center gap-1">
													${sum}{' '}
													<span className="text-2xl text-green-500">
														<AiFillCaretUp />
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* card-2 */}
								<div className="w-full md:w-1/2 xl:w-1/3 p-6">
									<div className="bg-gradient-to-b from-pink-200 to-pink-100 border-b-4 border-pink-500 rounded-lg shadow-xl p-5">
										<div className="flex flex-row items-center">
											<div className="flex-shrink pr-4">
												<div className="rounded-full p-5 bg-pink-600">
													<FaUsers className="text-[32px] text-white font-extrabold" />
												</div>
											</div>
											<div className="flex-1 text-right md:text-center">
												<h2 className="font-bold uppercase text-gray-600">Total Users</h2>
												<p className="font-bold text-3xl flex justify-end lg:justify-center items-center gap-1">
													{totalUsers}
													<span className="text-2xl text-pink-500">
														<AiFillCaretUp />
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* card-3 */}
								<div className="w-full md:w-1/2 xl:w-1/3 p-6">
									<div className="bg-gradient-to-b from-yellow-200 to-yellow-100 border-b-4 border-yellow-600 rounded-lg shadow-xl p-5">
										<div className="flex flex-row items-center">
											<div className="flex-shrink pr-4">
												<div className="rounded-full p-5 bg-yellow-600">
													<FaShoppingCart className="text-[32px] text-white font-extrabold" />
												</div>
											</div>
											<div className="flex-1 text-right md:text-center">
												<h2 className="font-bold uppercase text-gray-600">Total Orders</h2>
												<p className="font-bold text-3xl flex justify-end lg:justify-center items-center gap-1">
													{ordersCount}
													<span className="text-2xl text-yellow-600">
														<AiFillCaretUp />
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* card -4  */}
								<div className="w-full md:w-1/2 xl:w-1/3 p-6">
									<div className="bg-gradient-to-b from-blue-200 to-blue-100 border-b-4 border-blue-500 rounded-lg shadow-xl p-5">
										<div className="flex flex-row items-center">
											<div className="flex-shrink pr-4">
												<div className="rounded-full p-5 bg-blue-600">
													<MdInventory2 className="text-[32px] text-white font-extrabold" />
												</div>
											</div>
											<div className="flex-1 text-right md:text-center">
												<h2 className="font-bold uppercase text-gray-600">Total Products</h2>
												<p className="font-bold text-3xl">{productsCount}</p>
											</div>
										</div>
									</div>
								</div>

								{/* card -  5 */}
								<div className="w-full md:w-1/2 xl:w-1/3 p-6">
									<div className="bg-gradient-to-b from-indigo-200 to-indigo-100 border-b-4 border-indigo-500 rounded-lg shadow-xl p-5">
										<div className="flex flex-row items-center">
											<div className="flex-shrink pr-4">
												<div className="rounded-full p-5 bg-indigo-600">
													<TbMessages className="text-[32px] text-white font-extrabold" />
												</div>
											</div>
											<div className="flex-1 text-right md:text-center">
												<h2 className="font-bold uppercase text-gray-600">Total Messages</h2>
												<p className="font-bold text-3xl">{totalContactMessage}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<OrderCharts />
				</div>
			)}
		</>
	);
};

export default AdminHome;
