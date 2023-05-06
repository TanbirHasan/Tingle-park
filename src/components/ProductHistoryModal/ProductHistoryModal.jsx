import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DownloadIcon from '@mui/icons-material/Download';

import { IconButton, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import Pdf from 'react-to-pdf';
import { baseUrl } from '../../baseURL';

const ProductHistoryModal = ({ open, handleClose, data }) => {
	const { _id, productsName } = data;

	const [count, setCount] = useState(0);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(4);
	const pages = Math.ceil(count / size);

	const now = new Date();
	const date = now.toLocaleString();

	const {
		data: productHistories = [],
		refetch,
		isLoading,
		isPreviousData,
	} = useQuery({
		queryKey: ['productHistories', _id, size, page],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/productHistory/${_id}?page=${page}&size=${size}`);
			const result = await res.json();
			const data = result.history;
			setCount(result.count);
			return data;
		},
		keepPreviousData: true,
	});

	const ref = useRef();
	const options = {
		orientation: 'landscape',
		unit: 'in',
	};

	//* Delete single history
	const handleSingleHistoryDelete = (history) => {
		fetch(`${baseUrl}/productHistory/singleHistory/${history._id}`, {
			method: 'DELETE',
		})
			.then((res) => res.json())
			.then((data) => {
				toast.success('History Cleared Successfully');
				refetch();
			});
	};

	//! clear oder history
	const handleClearAllHistory = () => {
		fetch(`${baseUrl}/productHistory/${_id}`, {
			method: 'DELETE',
		})
			.then((res) => res.json())
			.then((data) => {
				toast.success('History Cleared Successfully');
				refetch();
			});
	};

	return (
		<div>
			<Dialog
				open={open}
				// fullScreen
				maxWidth={'xl'}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">
					<DialogActions>
						<Button variant="outlined" onClick={handleClose} autoFocus>
							Close
						</Button>
					</DialogActions>
				</DialogTitle>
				<h1 className="text-4xl text-center my-4">{`${productsName}'s History`}</h1>
				{isLoading ? (
					<div className="flex h-screen justify-center items-center">
						<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
					</div>
				) : (
					<>
						<DialogContent>
							<div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
								<div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
									<div className="border-b flex items-center justify-between">
										<Button
											variant="outlined"
											color="error"
											onClick={handleClearAllHistory}
											autoFocus
											sx={{ ml: 4 }}>
											Delete All
										</Button>
										<div className="mr-8 ">
											<Pdf targetRef={ref} options={options} scale={0.8} filename={`${date}.pdf`}>
												{({ toPdf }) => (
													<Tooltip arrow title="Download this page" placement="top">
														<IconButton
															onClick={toPdf}
															className="button"
															aria-label="delete"
															size="large">
															<DownloadIcon fontSize="inherit" />
														</IconButton>
													</Tooltip>
												)}
											</Pdf>
										</div>
									</div>
									<table ref={ref} className="min-w-full leading-normal">
										{isLoading && (
											<div className="flex h-screen justify-center items-center">
												<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />{' '}
											</div>
										)}
										<thead>
											<tr>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													Buying Price
												</th>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													Old Price
												</th>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													Current Price
												</th>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													Price Difference ($)
												</th>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													Old Stock Amount
												</th>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													New Stock Amount
												</th>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													New Stock Added
												</th>
												<th
													scope="col"
													className="px-5 py-3 text-sm font-normal  text-gray-800 uppercase bg-white border-b border-gray-200">
													Latest Updated at
												</th>
											</tr>
										</thead>
										<tbody>
											{productHistories.map((history) => (
												<tr className="" key={history._id}>
													<td className="px-5 py-5 text-lg bg-white border-b border-gray-200">
														<p className="text-gray-900 whitespace-no-wrap text-center">
															${data.oldPrice}
														</p>
													</td>
													<td className="px-5 py-5 text-lg bg-white border-b border-gray-200">
														<p className="text-gray-900 whitespace-no-wrap text-center">
															${history.oldPrice}
														</p>
													</td>
													<td className="px-5 py-5 text-lg  bg-white border-b border-gray-200">
														<p className={`whitespace-no-wrap text-center`}>
															${history.currentPrice}
														</p>
													</td>
													<td className="px-5 py-5 text-lg bg-white border-b border-gray-200">
														<p
															className={`${
																history.currentPrice - history.oldPrice >= 0
																	? 'text-green-600'
																	: 'text-red-600'
															} font-bold whitespace-no-wrap text-center`}>
															{history.currentPrice - history.oldPrice > 0
																? '+' + (history.currentPrice - history.oldPrice)
																: history.currentPrice - history.oldPrice}
														</p>
													</td>
													<td className="px-5 py-5 text-lg bg-white border-b border-gray-200">
														<p className="text-gray-900 whitespace-no-wrap text-center">
															{history.oldStockAmount}
														</p>
													</td>
													<td className="px-5 py-5 text-lg font-bold bg-white border-b border-gray-200">
														<p className="text-gray-900 whitespace-no-wrap text-center">
															{history.newStockAmount}
														</p>
													</td>
													<td className="px-5 py-5 text-lg font-bold bg-white border-b border-gray-200">
														<p
															className={`${
																history.newStockAdded >= 0 ? 'text-green-600' : 'text-red-500'
															} whitespace-no-wrap text-center`}>
															{history.newStockAdded > 0
																? '+' + history.newStockAdded
																: history.newStockAdded}
														</p>
													</td>
													<td className="px-5 py-5 text-md bg-white border-b border-gray-200">
														<p className="text-gray-900 whitespace-no-wrap text-center">
															{history.updatedAt}
														</p>
													</td>
													<td className="px-5 py-5 text-md bg-white border-b border-gray-200">
														<p className="text-gray-900 whitespace-no-wrap text-center">
															<IconButton
																onClick={() => handleSingleHistoryDelete(history)}
																aria-label="delete HISTORY">
																<CancelOutlinedIcon color="error" />
															</IconButton>
														</p>
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
												className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100">
												<svg
													width="9"
													fill="currentColor"
													height="8"
													className=""
													viewBox="0 0 1792 1792"
													xmlns="http://www.w3.org/2000/svg">
													<path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
												</svg>
											</button>
											<>
												{productHistories && (
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
																}}>
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
												className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100">
												<svg
													width="9"
													fill="currentColor"
													height="8"
													className=""
													viewBox="0 0 1792 1792"
													xmlns="http://www.w3.org/2000/svg">
													<path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						</DialogContent>
					</>
				)}
			</Dialog>
		</div>
	);
};

export default ProductHistoryModal;
