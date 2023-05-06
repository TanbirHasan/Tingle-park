import { Avatar, Rating } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BeatLoader, PropagateLoader } from 'react-spinners';
import { baseUrl } from '../../../baseURL';
import { AuthContext } from './../../../Contexts/UserAuthProvider';

const Reviews = ({ product, review, refetch, isLoading, page, pages, size, setPage }) => {
	const { user } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const [ratings, setRatings] = useState(0);
	const [previousRatings, setPreviousRatings] = useState(0);
	const [loading, setLoading] = useState(false);

	const date = format(new Date(), 'PPpp');

	useEffect(() => {
		const previousRating = ratings;
		setPreviousRatings(previousRating);
	}, [ratings]);

	const reviewRatings = review.map((r) => r.userRating);
	const sum = reviewRatings.reduce((a, b) => a + b, 0);
	const avg = (sum + previousRatings) / (reviewRatings.length + 1) || 0;

	// console.log(`sum - ${sum} === average =${avg}`);

	// console.log(`avg = ${avg} ==== previousRatings = ${previousRatings}`);

	const handleReview = (data) => {
		const { name, email, review } = data;
		const userReview = {
			name,
			email,
			review,
			userRating: ratings,
			userImage: user?.photoURL,
			productId: product._id,
			date,
			averageRatings:
				reviewRatings.length === 0 ? parseFloat(previousRatings) : parseFloat(avg.toFixed(2)),
		};

		const averageRating = {
			ratings:
				reviewRatings.length === 0 ? parseFloat(previousRatings) : parseFloat(avg.toFixed(2)),
		};

		if (userReview && averageRating) {
			setLoading(true);
			fetch(`${baseUrl}/reviews`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify(userReview),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data) {
						fetch(`${baseUrl}/products/average-rating/${product._id}`, {
							method: 'PUT',
							headers: {
								'content-type': 'application/json',
							},
							body: JSON.stringify(averageRating),
						})
							.then((res) => res.json())
							.then((data) => {
								if (data) {
									toast.success('Review added successfully');
									refetch();
									reset();
									setLoading(false);
								}
							});
					}
					refetch();
				})
				.catch((err) => {
					toast.error(err.message);
					setLoading(false);
				});
		}

		reset();
	};

	return (
		<div
			className={`mt-10 flex flex-col-reverse md:flex-row ${
				review.length > 0 ? 'h-[1000px] lg:h-[600px]' : 'h-full'
			} flex-col lg:flex-row customScroll text-center lg:text-left gap-10`}
		>
			<div className="review-card lg:w-[50%] overflow-y-auto md:overflow-x-auto ">
				{/* Loader */}
				{isLoading && (
					<div className="flex h-screen justify-center items-center">
						<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
					</div>
				)}
				{review.map((r) => (
					<div key={r._id} className="flex  flex-col lg:flex-row gap-5 mb-10">
						<div>
							<Avatar alt="Remy Sharp" src={r.userImage} className="block mx-auto md:mx-0" />
						</div>
						<div className="">
							<div>
								<h1 className="text-[#3d464d] font-medium mb-2">
									{r.name} -{' '}
									<span className="text-[#3d464d] text-[12.8px] italic">
										{formatDistanceToNow(new Date(r.createdAt), {
											addSuffix: true,
										})}
									</span>
								</h1>
								{/* <h1 className="text-[#3d464d] font-medium mb-2">
									{r.name} - <span className="text-[#3d464d] text-[12.8px] italic">{r.date}</span>
								</h1> */}
							</div>
							<div className="flex justify-center md:justify-start items-center mb-2 gap-1">
								<Rating name="half-rating-read" value={r.userRating} precision={0.5} readOnly />
							</div>
							<div>
								<p className="text-[#6c757d]">{r.review}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{!user?.uid ? (
				<div className="flex flex-col items-center justify-center">
					<h1 className="text-4xl font-extrabold mb-5 md:ml-20">
						Please login
						<span className="ml-3">to give a review</span>
					</h1>
					<Link to={'/login'}>
						<button class="group relative inline-block focus:outline-none focus:ring">
							<span class="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-y-0 group-hover:translate-x-0 "></span>

							<span class="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75">
								Login
							</span>
						</button>
					</Link>
				</div>
			) : (
				<div>
					<h1 className="text-[#3d464d] text-[28.5px] font-medium mb-5">Leave a review</h1>
					<p className="text-[#6c757d]">
						Your email address will not be published. Required fields are marked *
					</p>

					<form onSubmit={handleSubmit(handleReview)}>
						<div className="flex flex-col md:flex-row items-center gap-2 mt-5">
							<div className="text-[#6c757d] text-lg font-medium">
								Your Rating * <span className="hidden md:inline-block">:</span>{' '}
							</div>
							<Rating
								name="simple-controlled"
								value={ratings}
								size="large"
								precision={0.5}
								onChange={(event, newValue) => {
									setRatings(newValue);
								}}
							/>
						</div>

						<div className="my-5">
							<label
								htmlFor="review"
								className={`text-[#6c757d]    ${errors.review && 'text-red-600'}`}
							>
								Your Review *
							</label>
							<textarea
								{...register('review', {
									required: 'Review is required',
									minLength: {
										value: 10,
										message: 'Review must have at least 10 characters',
									},
								})}
								cols="30"
								rows="5"
								className={`w-full mt-3 focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#495057]  border-[#D4D9DF] ${errors.review &&
									'focus:border-red-600'}`}
							></textarea>
							{errors.review && <p className="text-red-600 text-right">{errors.review?.message}</p>}
						</div>
						<div className="mt-5">
							<label
								htmlFor="name"
								className={`text-[#6c757d]    ${errors.name && 'text-red-600'}`}
							>
								Your Name *
							</label>
							<input
								type="text"
								defaultValue={user?.displayName}
								{...register('name', { required: 'Name is required' })}
								className={`w-full mt-3 focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#495057]  border-[#D4D9DF] ${errors.name &&
									'focus:border-red-600'}`}
							/>
							{/* {errors.name && <p className="text-red-600 text-right">{errors.name?.message}</p>} */}
						</div>
						<div className="my-5">
							<label
								htmlFor="name"
								className={`text-[#6c757d]    ${errors.email && 'text-red-600'}`}
							>
								Your Email *
							</label>
							<input
								type="text"
								defaultValue={user?.email}
								{...register('email', {
									required: 'Email Address is required',
									pattern: {
										value: /.+@.+\..+/i,
										message: 'Please enter a valid email address',
									},
								})}
								className={`w-full mt-3 focus:outline-0 focus:ring-0 focus:ring-transparent focus:border-[#FFD333] placeholder:text-[#495057]  border-[#D4D9DF] ${errors.email &&
									'focus:border-red-600'} `}
							/>
							{/* {errors.email && <p className="text-red-600 text-right">{errors.email?.message}</p>} */}
						</div>
						<button type="submit" className="bg-[#ffd333] px-10 py-2 text-[#3d464d] font-medium">
							{loading ? <BeatLoader color="#36d7b7" /> : <span>Leave your Review</span>}
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Reviews;
