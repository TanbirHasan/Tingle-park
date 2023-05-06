import { Button, DialogTitle, Rating } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

const ViewProductModal = ({ open, close, data }) => {
	const {
		productsName,
		picture,
		category,
		oldPrice,

		newPrice,
		ratings,
		description,
		stockAmount,
		createdAt,
	} = data;

	const date = createdAt.slice(0, 24);

	return (
		<div className="p-10">
			<Dialog
				open={open}
				onClose={close}
				maxWidth={'lg'}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title" className="flex justify-end">
					<Button variant="outlined" onClick={close}>
						Close
					</Button>
				</DialogTitle>
				<div className="flex items-center flex-col md:flex-row gap-10 lg:w-[90%] mx-auto my-10">
					<div className="w-full lg:w-[40%] hidden lg:block">
						<Swiper
							slidesPerView={1}
							loop={true}
							speed={1200}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
							modules={[Autoplay, Navigation]}
							className="mySwiper1">
							<SwiperSlide>
								<img src={picture} alt="" className="w-[560px] mx-auto" />
							</SwiperSlide>
						</Swiper>
					</div>

					<div className="p-10 sm:p-0">
						<h1 className="text-[#3d464d] text-3xl font-bold my-4">Name: {productsName}</h1>

						<p className="my-2 font-bold text-[#3d464d] text-xl">Category : {category}</p>

						<div className="flex gap-10">
							<p className="text-[#3d464d]  font-bold my-3">Old Price: ${oldPrice}</p>
							<p className="text-[#3d464d]  font-bold my-3">New Price: ${newPrice}</p>
						</div>
						<div className="flex  mt-2 items-center font-bold my-2">
							<span>Ratings - </span>
							<Rating
								name="half-rating-read"
								size="small"
								value={ratings}
								precision={0.5}
								readOnly
							/>
						</div>
						<p className="my-2 font-bold text-[#3d464d]">Stock : {stockAmount}</p>
						<p className="my-2 font-bold text-[#3d464d]">Created at : {date}</p>
						<p className="my-4 text-[#6c757d]">Details : {description}</p>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default ViewProductModal;
