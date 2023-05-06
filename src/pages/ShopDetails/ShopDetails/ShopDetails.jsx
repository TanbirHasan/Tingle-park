import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

import { AiOutlineTwitter } from 'react-icons/ai';
import { BsFillCartFill } from 'react-icons/bs';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { ImPinterest } from 'react-icons/im';

import { Rating } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { addItemsToCart, incrementCart } from '../../../features/CartSlice';
import { fetchProducts } from '../../../features/ProductSlice';
import ProductDescription from '../ProductDescription/ProductDescription';
import ProductInformation from '../ProductInformation/ProductInformation';
import Reviews from '../Reviews/Reviews';
import { baseUrl } from './../../../baseURL';

const ShopDetails = () => {
	const { products, isLoading: loading } = useSelector((state) => state.productsReducer);
	const dispatch = useDispatch();
	const location = useLocation();

	const [page, setPage] = useState(0);
	const [size, setSize] = useState();
	const [sizeValue, setSizeValue] = React.useState('');
	const [colorValue, setColorValue] = React.useState('');

	const handleChangeSize = (event) => {
		setSizeValue(event.target.value);
	};

	const handleChangeColor = (event) => {
		setColorValue(event.target.value);
	};

	const {
		_id,
		productsName,
		picture,
		sizes_color,
		quantity,
		newPrice,
		ratings,
		description,
		stockAmount,
		size: sizes,
		createdAt,
		category,
		categoryId,
		oldPrice,
		ifColorAvailable,
		color: colors,
	} = location?.state;

	const [addToCart, setAddedToCart] = useState(false);

	const { data: reviews = [], refetch, isLoading } = useQuery({
		queryKey: ['reviews', size, page, _id],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/reviews/${_id}`);
			const data = await res.json();
			return data.review;
		},
	});

	const specificProductRatingAverage = reviews.find((r) => r.productId === _id);
	// const specificProductReview = reviews.filter((r) => r.productId === _id);

	const pages = Math.ceil(reviews.length / size);

	let product = {
		_id,
		productsName,
		picture,
		sizes_color,
		quantity,
		newPrice,
		ratings,
		description,
		size: sizes,
		sizeValue,
		stockAmount,
		createdAt,
		category,
		categoryId,
		oldPrice,
		color: colors,
		ifColorAvailable,
		colorValue,
	};
	const remainingProducts = products.filter((p) => p._id !== _id);
	const similarCategoryProducts = remainingProducts.filter((p) => p.categoryId === categoryId);

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const handleAddToCart = (product) => {
		dispatch(incrementCart());
		dispatch(addItemsToCart(product));
		setAddedToCart(!addToCart);
	};

	return (
		<div className="w-[90%] mx-auto">
			<div className="my-10">
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
								Shop Detail
							</Link>
						</li>
					</ol>
				</nav>
			</div>

			{isLoading ? (
				<div className="flex h-screen justify-center items-center">
					<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
				</div>
			) : (
				<div className="my-10 flex flex-col  lg:flex-row gap-10">
					<div className="bg-white lg:w-[40%]">
						<Swiper
							slidesPerView={1}
							loop={true}
							speed={1200}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
							modules={[Autoplay, Navigation]}
							className="mySwiper1"
						>
							<SwiperSlide>
								<img src={picture} alt="" className=" w-[560px] mx-auto" />
							</SwiperSlide>
						</Swiper>
					</div>

					<div className="flex bg-white lg:h-[547px] items-center">
						<div className=" w-full p-10">
							<h1 className="text-[#3d464d] text-3xl font-bold">{productsName}</h1>

							<div className="flex items-center  gap-1">
								<div className="flex justify-center mt-2 items-center">
									<Rating
										name="half-rating-read"
										size="small"
										value={specificProductRatingAverage?.averageRatings}
										precision={0.5}
										readOnly
									/>
									<span className="ml-1 mb-1 text-[#6c757d]">({reviews.length}) reviews</span>
								</div>
							</div>

							<h1 className="text-[#3d464d] text-3xl font-bold my-4">$ {newPrice}</h1>

							<p className="my-4 text-[#6c757d]">{description}</p>

							<div className="my-3">
								{sizes_color && (
									<>
										<FormControl>
											<FormLabel id="demo-controlled-radio-buttons-group">Size</FormLabel>
											<RadioGroup
												row
												aria-labelledby="demo-controlled-radio-buttons-group"
												name="controlled-radio-buttons-group"
												value={sizeValue}
												onChange={handleChangeSize}
											>
												{sizes.map((s, i) => (
													<FormControlLabel key={i} value={s} control={<Radio />} label={s} />
												))}
											</RadioGroup>
										</FormControl>
									</>
								)}
							</div>

							<div className="my-3">
								{ifColorAvailable && (
									<>
										<FormControl>
											<FormLabel id="demo-controlled-radio-buttons-group">Color</FormLabel>
											<RadioGroup
												row
												aria-labelledby="demo-controlled-radio-buttons-group"
												name="controlled-radio-buttons-group"
												value={colorValue}
												onChange={handleChangeColor}
											>
												{colors.map((s, i) => (
													<FormControlLabel key={i} value={s} control={<Radio />} label={s} />
												))}
											</RadioGroup>
										</FormControl>
									</>
								)}
							</div>

							<div className="flex flex-col lg:flex-row items-center gap-10">
							

								<div>
									<button
										type="button"
										disabled={addToCart ? true : false}
										onClick={() => handleAddToCart(product)}
										className="inline-flex mt-5 items-center justify-center w-[200px] h-[41px] text-xl  font-semibold text-center  border-0 bg-[#FFD333] text-[#3D464D] hover:bg-[#FFCB0D] duration-500"
									>
										<BsFillCartFill /> <span className="ml-2">Add to cart</span>
									</button>
								</div>
							</div>

							<div className="mt-5 flex items-center gap-4 ">
								<h1 className="text-[#3d464d] font-bold">Share on:</h1>
								<div className="flex items-center gap-4 text-[#1b1f22]">
									<FaFacebookF /> <AiOutlineTwitter /> <FaLinkedinIn /> <ImPinterest />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="my-10 bg-white p-10">
				<Tabs>
					<TabList>
						<Tab>Description</Tab>
						<Tab>Information</Tab>
						<Tab>Reviews ({reviews.length})</Tab>
					</TabList>

					<TabPanel>
						<ProductDescription product={product} />
					</TabPanel>
					<TabPanel>
						<ProductInformation product={product} />
					</TabPanel>
					<TabPanel>
						<Reviews
							product={product}
							refetch={refetch}
							review={reviews}
							isLoading={isLoading}
							page={page}
							setPage={setPage}
							pages={pages}
							size={size}
						/>
					</TabPanel>
				</Tabs>
			</div>

			<div className="my-20">
				<div className="flex items-center gap-5 my-5">
					<h1 className="uppercase text-2xl lg:text-4xl text-[#3D464D] font-bold  ">
						You may also like
					</h1>
					<div className="flex flex-grow flex-wrap">
						<span className="w-full  border_style "></span>
					</div>
				</div>
				<Swiper
					slidesPerView={4}
					spaceBetween={30}
					speed={1200}
					autoHeight={true}
					breakpoints={{
						200: {
							slidesPerView: 1,
						},

						640: {
							slidesPerView: 2,
						},

						768: {
							slidesPerView: 4,
						},
					}}
					loop={true}
					// loopFillGroupWithBlank={true}

					autoplay={{
						delay: 2500,
						disableOnInteraction: false,
					}}
					modules={[Autoplay, Pagination, Navigation]}
					className="mySwiper_Details"
				>
					{loading && (
						<div className="flex h-screen justify-center items-center">
							<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
						</div>
					)}
					{similarCategoryProducts.map((product) => (
						<SwiperSlide key={product._id}>
							{' '}
							<ProductCard product={product} />{' '}
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default ShopDetails;
