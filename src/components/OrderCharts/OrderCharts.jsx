import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { baseUrl } from '../../baseURL';

const OrderCharts = () => {
	let { data: orders = [], refetch, isLoading, isPreviousData } = useQuery({
		queryKey: ['orders'],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/orders`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
				},
			});
			const result = await res.json();
			const data = result.orders;
			return data;
		},
	});

	let march = orders.filter(
		(order) => order.orderPlaced.includes('Mar') && order.orderPlaced.includes('2023')
	);
	let april = orders.filter((order) => order.orderPlaced.includes('Apr'));
	let may = orders.filter((order) => order.orderPlaced.includes('May'));

	const data = [
		{
			name: 'March',

			2023: march.length,
		},
		{
			name: 'April',
			2023: april.length,
		},
		{
			name: 'May',

			2023: may.length,
		},
		{
			name: 'June',

			2023: 20,
		},
		{
			name: 'July',

			2023: 16,
		},
	];

	return (
		<div>
			<div className="relative flex flex-col my-10  bg-white  mb-6 shadow-lg rounded lg:w-[800px] mx-auto">
				<div className="rounded-t mb-0 px-4 py-3 bg-transparent">
					<div className="flex flex-wrap items-center">
						<div className="relative w-full max-w-full flex-grow flex-1">
							<h2 className="text-gray-700 text-2xl font-semibold">Total orders</h2>
						</div>
					</div>
				</div>
				<div className="my-10 flex justify-center">
					<ResponsiveContainer width={'100%'} height={500} min-width={300}>
						<BarChart
							// width={700}
							// height={500}
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							{/* <CartesianGrid strokeDasharray="3 3" /> */}
							<XAxis dataKey="name" fill="#070707" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="2023" fill="#16A34A" />
							{/* <Bar dataKey="uv" "#82ca9d" /> */}
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default OrderCharts;
