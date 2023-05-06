import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { baseUrl } from './../../../baseURL';

const AllUsers = () => {
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(6);

	const pages = Math.ceil(count / size);

	const { data: users = [], refetch, isLoading, isPreviousData } = useQuery({
		queryKey: ['users', page, size],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/users/non-admin?page=${page}&size=${size}`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
				},
			});
			const result = await res.json();
			const data = result.users;
			setCount(result.count);
			return data;
		},
	});

	//* updating user status to "active"
	const handleActiveUser = (user) => {
		fetch(`${baseUrl}/users/user/activate/${user._id}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.modifiedCount) {
					refetch();
					toast.success(`${user.name}'s account activated successfully`);
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
			});
	};

	//* updating user status to "deactivated"
	const handleDeactivateUser = (user) => {
		fetch(`${baseUrl}/users/user/deactivate/${user._id}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.modifiedCount) {
					refetch();
					toast.success(`${user.name}'s account deactivated`);
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
			});
	};

	return (
		<>
			{isLoading ? (
				<div className="flex h-screen justify-center items-center">
					<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />{' '}
				</div>
			) : (
				<section className="py-1 bg-gray-50 h-screen flex justify-center items-center">
					<div className="w-full xl:max-w-5xl mb-12 xl:mb-0 px-4 mx-auto mt-10">
						<div className="relative flex flex-col min-w-0  bg-white w-full mb-6 shadow-xl rounded ">
							<div className="rounded-t mb-0 px-4 py-3 border-0">
								<div className="flex flex-wrap items-center justify-center">
									<div className="relative w-full px-4 max-w-full flex-grow flex-1">
										<h3 className="font-semibold text-base text-md text-center">All Users</h3>
									</div>
								</div>
							</div>

							<div className="block w-full overflow-x-auto">
								<table className="items-center bg-transparent w-full border-collapse ">
									<thead>
										<tr className="bg-gray-200">
											<th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold ">
												Users
											</th>
											<th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold ">
												Email
											</th>
											<th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold ">
												Status
											</th>
											<th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold ">
												Action
											</th>
										</tr>
									</thead>

									<tbody>
										{users?.map((user) => (
											<tr key={user._id}>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4  text-gray-700 text-center">
													<div>
														<p>{user.name}</p>
													</div>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4 text-center">
													<p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4 text-center">
													{/* <p
															className={`text-gray-900 whitespace-no-wrap font-bold capitalize ${
																user.status === 'active' ? 'text-green-700' : 'text-red-700'
															}`}
														>
															{user.status}
														</p> */}
													{user.status === 'active' ? (
														<span class="px-2 py-1  text-base rounded-full text-green-600   bg-green-200 ">
															{user.status}
														</span>
													) : (
														<span class="px-2 py-1  text-base rounded-full text-red-600  bg-red-200 ">
															{user.status}
														</span>
													)}
												</td>

												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4 text-center">
													{user?.role === 'admin' ? (
														<>
															<span className="px-4 py-2 mt-5 text-base rounded-full text-green-600  bg-green-200 ">
																Admin
															</span>
														</>
													) : (
														<div className="space-x-5 flex justify-center ">
															<button
																disabled={user.status === 'active' ? true : false}
																onClick={() => handleActiveUser(user)}
																className=" py-1 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-sm "
															>
																Active
															</button>

															<button
																disabled={user.status === 'deactivated' ? true : false}
																onClick={() => handleDeactivateUser(user)}
																className="py-1 px-4  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-sm "
															>
																Deactivate
															</button>
														</div>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
								<div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between border-t-2">
									<div className="flex items-center">
										<button
											onClick={() => {
												setPage((old) => Math.max(old - 1, 0));
											}}
											disabled={page === 0}
											type="button"
											className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
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
											<>
												{[...Array(pages).keys()].map((number) => (
													<button
														key={number}
														className={`w-full px-4 py-2 text-base  bg-white border-t border-b hover:bg-gray-100 ${
															page === number
																? ' font-extrabold text-xl border bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 text-white'
																: 'text-indigo-500'
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
										</>

										<button
											onClick={() => {
												setPage((old) => old + 1);
											}}
											disabled={isPreviousData}
											type="button"
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
				</section>
			)}
		</>
	);
};

export default AllUsers;
