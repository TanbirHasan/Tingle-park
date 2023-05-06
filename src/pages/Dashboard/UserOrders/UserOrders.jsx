import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import { baseUrl } from '../../../baseURL';
import OrderDetailsModal from '../../../components/OrderDetailsModal/OrderDetailsModal';
import { AuthContext } from './../../../Contexts/UserAuthProvider';
import { FaGreaterThan, FaLessThan } from 'react-icons/fa';

const UserOrders = () => {
	const { user } = useContext(AuthContext);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(4);
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState({});

	const pages = Math.ceil(count / size);

	const handleClickOpenModal = (order) => {
		setOpenModal(true);
		setModalData(order);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const { data: orders = [], refetch, isLoading, isPreviousData } = useQuery({
		queryKey: ['orders', page, size, user?.email],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/orders/${user?.email}?page=${page}&size=${size}`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
				},
			});
			const result = await res.json();
			const data = result.orders;
			setCount(result.count);
			return data;
		},
	});

	return (
		<>
			{isLoading ? (
				<div className="flex h-screen justify-center items-center">
					<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />{' '}
				</div>
			) : (
				<div className="py-1 bg-gray-50 flex h-screen justify-center items-center">
					<div className="w-full xl:max-w-5xl mb-12 xl:mb-0 px-4 mx-auto mt-10">
						<div className="relative flex flex-col min-w-0  bg-white w-full mb-6 shadow-xl rounded">
							<div class="rounded-t mb-0 px-4 py-3 border-0">
								<div class="flex flex-wrap items-center justify-center">
									<div class="relative w-full px-4 max-w-full flex-grow flex-1">
										<h3 class="font-semibold text-base text-md text-center">All Orders</h3>
									</div>
								</div>
							</div>
							<div>
								<div className="block w-full overflow-x-auto">
									<table className="items-center bg-transparent w-full border-collapse">
										<thead>
											<tr className="bg-gray-200">
												<th
													scope="col"
													className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold "
												>
													Name
												</th>

												<th
													scope="col"
													className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold "
												>
													Email
												</th>
												<th
													scope="col"
													className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold "
												>
													Order Date
												</th>
												<th
													scope="col"
													className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold "
												>
													Action
												</th>
											</tr>
										</thead>
										<tbody>
											{orders.map((order) => (
												<tr key={order._id}>
													<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
														<div>{order.firstName}</div>
													</td>
													<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
														{order.email}
													</td>
													<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
														{order.orderPlaced}
													</td>
													<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
														<button
															onClick={() => handleClickOpenModal(order)}
															type="button"
															className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
														>
															See Details
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
									<div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
										<div className="flex items-center">
											<button
												onClick={() => {
													setPage((old) => Math.max(old - 1, 0));
												}}
												disabled={page === 0}
												type="button"
												className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
											>
												<FaLessThan size={8} />
											</button>
											<>
												{orders && (
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
												)}
											</>

											<button
												onClick={() => {
													setPage((old) => old + 1);
												}}
												// Disable the Next Page button until we know a next page is available
												disabled={isPreviousData}
												type="button"
												className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
											>
												<FaGreaterThan size={8} />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{openModal && (
						<OrderDetailsModal
							openModal={openModal}
							handleCloseModal={handleCloseModal}
							data={modalData}
						/>
					)}
				</div>
			)}
		</>
	);
};

export default UserOrders;
