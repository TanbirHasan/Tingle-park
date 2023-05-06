import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import React, { useContext } from 'react';
import { Menu, MenuItem, Sidebar, useProSidebar } from 'react-pro-sidebar';
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { AuthContext } from '../Contexts/UserAuthProvider';
import useAdmin from '../Hooks/useAdmin';
import DashboardNav from '../components/DashboardNav/DashboardNav';
import TopNavbar from '../components/TopNavbar/TopNavbar';

const DashboardLayout = () => {
	const { toggleSidebar, collapseSidebar, broken, collapsed } = useProSidebar();
	const { user, logOut } = useContext(AuthContext);

	const [isAdmin, isAdminLoading] = useAdmin(user?.email);

	if (isAdminLoading) {
		return (
			<div className="flex h-screen justify-center items-center">
				<PropagateLoader color="#FFD333" size={30} speedMultiplier={2} />
			</div>
		);
	}

	return (
		<div className="bg-white">
			<TopNavbar />
			{/* <Navbar /> */}

			<div className="flex lg:gap-10">
				<div className="lg:w-[300px]">
					<Sidebar
						backgroundColor="#ffff"
						transitionDuration={800}
						width="300px"
						style={{ position: 'fixed'}}
						breakPoint="lg"
					>
						<aside className="flex flex-col  h-screen px-4 py-8 overflow-y-auto  border-r rtl:border-r-0 rtl:border-l ">
							<div className="flex flex-col  flex-1 mt-6 mb-20">
								<Link to={'/'} className="mb-20">
									<h1 className="uppercase text-[30px] text-center font-extrabold">
										<span className="bg-[#3d464d] text-[#ffd333] px-2">Multi</span>
										<span className="bg-[#ffd333] text-[#3d464d] px-2">Shop</span>
									</h1>
								</Link>
								<Menu>
									{isAdmin ? (
										<>
											<NavLink
												to="/dashboard/home"
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
											>
												<MenuItem active={true} icon={<HomeOutlinedIcon />}>
													Home
												</MenuItem>
											</NavLink>

											<NavLink
												to="/dashboard/allProducts"
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
											>
												<MenuItem active={true} icon={<Inventory2OutlinedIcon />}>
													All Products
												</MenuItem>
											</NavLink>

											{/* <NavLink
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
												to="/dashboard/addProducts">
												<MenuItem active={true} icon={<ProductionQuantityLimitsRoundedIcon />}>
													Add Products
												</MenuItem>
											</NavLink> */}

											<NavLink
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
												to="/dashboard/contact-messages"
											>
												<MenuItem active={true} icon={<ForumOutlinedIcon />}>
													Contact Messages
												</MenuItem>
											</NavLink>

											<NavLink
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
												to="/dashboard/allUsers"
											>
												<MenuItem active={true} icon={<PeopleAltOutlinedIcon />}>
													All Users
												</MenuItem>
											</NavLink>

											<NavLink
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
												to="/dashboard/allOrders"
											>
												<MenuItem active={true} icon={<PeopleAltOutlinedIcon />}>
													All Orders
												</MenuItem>
											</NavLink>
										</>
									) : (
										<>
											<NavLink
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
												to="/"
											>
												<MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
											</NavLink>

											<NavLink
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
												to="/dashboard/userProfile"
											>
												<MenuItem icon={<AccountBoxOutlinedIcon />}>Profile</MenuItem>
											</NavLink>

											<NavLink
												className={({ isActive }) =>
													isActive ? 'text-md text-green-600 font-bold ' : ''
												}
												to="/dashboard/userOrders"
											>
												<MenuItem icon={<HistoryOutlinedIcon />}>Order History</MenuItem>
											</NavLink>
										</>
									)}
								</Menu>
							</div>

							<div className="">
								<Menu>
									<button
										onClick={() => {
											logOut();
											localStorage.removeItem('minion-commerce-token');
										}}
										className="inline-block rounded bg-indigo-600 px-8 py-3 w-full text-sm font-medium text-white transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
									>
										<span className="flex items-center justify-center gap-1">
											<LogoutIcon fontSize="medium" />
											<span className="text-lg">Logout</span>
										</span>
									</button>
								</Menu>
							</div>
						</aside>
					</Sidebar>
				</div>

				<div className="flex-grow w-full">
					<DashboardNav isAdmin={isAdmin} />

					<Outlet />
				</div>
			</div>
			<ScrollRestoration />
		</div>
	);
};

export default DashboardLayout;
