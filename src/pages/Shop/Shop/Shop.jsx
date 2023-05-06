import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { AuthContext } from '../../../Contexts/UserAuthProvider';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { baseUrl } from './../../../baseURL';

const Shop = () => {
	// const { products, isLoading } = useSelector((state) => state.productsReducer);
	// const dispatch = useDispatch();
	const { searchProducts } = useContext(AuthContext);

	const [sortingDropdown, setSortingDropdown] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(8);
	const [latest, setLatest] = useState(null);
	const [bestRated, setBestRated] = useState(null);

	const pages = Math.ceil(count / size);
	const menuRef = useRef();
	const menuRef2 = useRef();

	useEffect(() => {
		let handler = (e) => {
			if (!menuRef.current.contains(e.target)) {
				// setSortingDropdown(false);
				setShowDropdown(false);
			}
		};
		document.addEventListener('mousedown', handler);

		let handler2 = (e) => {
			if (!menuRef2.current.contains(e.target)) {
				setSortingDropdown(false);
			}
		};
		document.addEventListener('mousedown', handler2);

		return () => {
			document.removeEventListener('mousedown', handler);
			document.removeEventListener('mousedown', handler2);
		};
	}, []);

	const { data: products = [], refetch, isLoading } = useQuery({
		queryKey: ['products', page, size, latest, bestRated, searchProducts],
		latest,
		queryFn: async () => {
			const res = await fetch(
				`${baseUrl}/products/all-products?page=${page}&size=${size}&latest=${latest}&bestRated=${bestRated}&searchProducts=${searchProducts}`,
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
					},
				}
			);
			const result = await res.json();
			const data = result.products;
			setCount(result.count);
			return data;
		},
	});

	return (
		<div className="w-[90%] mx-auto">
			<div className="mt-10">
				<nav className="w-full h-[48px] flex px-4 bg-white ">
					<ol className="flex  space-x-2 ">
						<li className="flex items-center space-x-1">
							<Link
								to={'/'}
								className="flex items-center px-1 text-[#1b1f22] capitalize hover:underline"
							>
								Home
							</Link>
						</li>
						<li className="flex items-center space-x-1">
							<span className="dark:text-gray-400">/</span>
							<Link
								to={'/shop'}
								className="flex items-center px-1 text-[#1b1f22] capitalize hover:underline"
							>
								Shop
							</Link>
						</li>
						<li className="flex items-center space-x-1">
							<span className="dark:text-gray-400">/</span>
							<Link className="flex items-center px-1 capitalize text-[#6c757d] cursor-default">
								Shop List
							</Link>
						</li>
					</ol>
				</nav>
			</div>

			<div className="flex flex-col lg:flex-row gap-10">
				<div className="w-full">
					<div className="mt-10">
						<div className="flex justify-end items-center">
							<div className="flex items-center gap-3">
								<div>
									<div className="relative  flex items-center justify-between   duration-500 cursor-pointer  ">
										<div
											ref={menuRef2}
											onClick={() => setSortingDropdown(!sortingDropdown)}
											className="flex items-center gap-2"
										>
											<button className="font-semibold bg-white p-2 px-2 flex items-center hover:bg-[#ECECEC] duration-500 focus:outline outline-[#ECECEC]">
												<span className="text-sm">Sorting</span>
												<AiFillCaretDown className="text-xs ml-2" />
											</button>
											<ul
												className={`menu absolute   w-[10rem] bg-white z-10 top-[40px] right-[-1px] duration-500 flex flex-col group text-box border text-[#212529]  ${
													sortingDropdown ? 'dropdown-active' : 'dropdown-inactive'
												} `}
											>
												<>
													<button
														onClick={() => {
															refetch();
															setLatest(-1);
															setBestRated(null);
														}}
														className={`px-5 py-2 text-left hover:bg-[#F5F5F5] ${typeof latest ===
															'number' && 'text-yellow-400 font-bold'}`}
													>
														<p className="font-semibold">Latest</p>
													</button>

													<button
														onClick={() => {
															refetch();
															setBestRated(-1);
															setLatest(null);
														}}
														className={`px-5 py-2 text-left hover:bg-[#F5F5F5] ${typeof bestRated ===
															'number' && 'text-yellow-400 font-bold'}`}
													>
														<p className="font-semibold">Best Rated</p>
													</button>
												</>
											</ul>
										</div>
									</div>
								</div>
								<div ref={menuRef} onClick={() => setShowDropdown(!showDropdown)}>
									<div className="relative  flex items-center justify-between  duration-500 cursor-pointer">
										<div className="flex items-center gap-2">
											<button className="font-semibold bg-white p-2 px-2 flex items-center hover:bg-[#ECECEC] duration-500 focus:outline outline-[#ECECEC]">
												<span className="text-sm">Showing</span>
												<AiFillCaretDown className="text-xs ml-2" />
											</button>
											<ul
												className={`menu absolute   w-[10rem] bg-white z-10 top-[40px] right-[-1px] duration-500 flex flex-col group text-box border text-[#212529]  ${
													showDropdown ? 'dropdown-active' : 'dropdown-inactive'
												} `}
											>
												<>
													<button
														onClick={() => setSize(10)}
														className={`px-5 py-2 text-left hover:bg-[#F5F5F5]`}
													>
														<p className="font-semibold">10</p>
													</button>
													<button
														onClick={() => setSize(20)}
														className={`px-5 py-2 text-left hover:bg-[#F5F5F5]`}
													>
														<p className="font-semibold">20</p>
													</button>
													<button
														onClick={() => setSize(30)}
														className={`px-5 py-2 text-left hover:bg-[#F5F5F5]`}
													>
														<p className="font-semibold">30</p>
													</button>
												</>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{isLoading ? (
						<div className="flex h-screen justify-center items-center">
							<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
						</div>
					) : (
						''
					)}
					<div className="flex justify-center items-center gap-10 flex-wrap my-10  mx-auto">
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>

					<div className="flex  w-2/4 items-center  justify-center mx-auto  space-y-0 flex-row my-10 ">
						{isLoading ? (
							<div className="flex h-screen justify-center items-center">
								<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
							</div>
						) : (
							<>
								{[...Array(pages).keys()].map((number) => (
									<button
										key={number}
										className={`inline-flex items-center justify-center w-[35px] h-[38px] text-sm font-semibold border ${
											page === number
												? 'bg-[#FFD333] text-white font-extrabold text-xl'
												: 'text-[#FFD333]'
										}`}
										onClick={() => {
											setPage(number);
											window.scrollTo({ top: 0, behavior: 'smooth' });
										}}
									>
										{number + 1}
									</button>
								))}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shop;

// grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 my-10  mx-auto
