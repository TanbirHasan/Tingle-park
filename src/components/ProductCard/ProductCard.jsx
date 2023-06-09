import { Rating } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai';
import { BsFillCartFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItemsToCart, incrementCart } from '../../features/CartSlice';
import { addItemsToWishList, incrementWishList } from '../../features/WishListSlice';
import { fetchReviews } from './../../features/ReviewsSlice';
import './productCard.css';

const ProductCard = ({ product }) => {
	const { _id, productsName, picture, ratings, oldPrice, newPrice, stockAmount, createdAt } =
		product;

	const dispatch = useDispatch();
	const [cartClicked, setCartClicked] = useState(false);
	const [wishListClicked, setWishListClicked] = useState(false);

	const { reviews } = useSelector((state) => state.reviewsReducer);

	useEffect(() => {
		dispatch(fetchReviews());
	}, [dispatch]);

	const specificProductReview = reviews.filter((r) => r.productId === _id);

	const handleCart = (product) => {
		dispatch(incrementCart());
		setCartClicked(true);
		dispatch(addItemsToCart(product));
	};

	const handleWishList = (product) => {
		dispatch(incrementWishList());
		setWishListClicked(true);
		dispatch(addItemsToWishList(product));
	};
	return (
		<div>
			<div className="w-[305px]  shadow-xl hover:shadow-2xl duration-500 box mx-auto bg-white">
				<div>
					<div className="box">
						<img
							alt="Art"
							src={picture}
							className="h-[40%] lg:h-[300px] w-full mx-auto card-image"
						/>
					</div>
					<div className="middle flex gap-3 ">
						<button
							disabled={cartClicked ? true : false}
							onClick={() => handleCart(product)}
							className={`icon-button border border-[#3D464D] w-[40px] h-[40] cursor-pointer hover:text-[#FFD333] hover:bg-[#3D464D] text-[#3D464D]  hover:duration-500 ${
								cartClicked ? 'bg-[#3D464D] text-[#FFCA07]' : ''
							} `}>
							<BsFillCartFill
								className={`${
									cartClicked ? 'icon-button bg-[#cccccc] text-[#666666]' : ''
								} mx-auto`}
								size={20}
							/>
						</button>

						<button
							disabled={wishListClicked ? true : false}
							onClick={() => handleWishList(product)}
							className={`icon-button border border-[#3D464D] w-[40px] h-[40] cursor-pointer hover:text-[#FFD333] hover:bg-[#3D464D] text-[#3D464D]  hover:duration-500 ${
								wishListClicked ? 'bg-[#3D464D] text-[#FFCA07]' : ''
							} `}>
							<AiOutlineHeart
								className={`${
									wishListClicked ? 'icon-button bg-[#cccccc] text-[#666666]' : ''
								} mx-auto`}
								size={20}
							/>
						</button>

						<Link to={'/shop-details'} state={product}>
							<button className="border border-[#3D464D] w-[40px] h-[40] cursor-pointer hover:text-[#FFD333] hover:bg-[#3D464D] text-[#3D464D] p-2 hover:duration-500 ">
								<AiOutlineSearch className="mx-auto" size={20} />
							</button>
						</Link>
					</div>
				</div>

				<div className="text-center px-4 py-5">
					<Link to={'/shop-details'} state={product}>
						<h3 className=" text-2xl md:text-xl font-bold cursor-pointer hover:text-[#FFD333] duration-300">
							{productsName}
						</h3>
					</Link>
					<div className="flex justify-center items-center gap-5 mt-2">
						<p className="text-[#3d464d] font-medium text-2xl md:text-xl">${newPrice}</p>
						<p className="line-through text-[#6c757d] font-medium">${oldPrice}</p>
					</div>

					<div className="flex justify-center mt-2 items-center">
						<Rating name="half-rating-read" value={ratings} precision={0.5} readOnly />
						<span className="ml-1 mb-1 text-[#6c757d]">({specificProductReview.length})</span>
					</div>
					<p className="mt-2 max-w-sm text-gray-700"></p>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
