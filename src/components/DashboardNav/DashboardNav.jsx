import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar } from '@mui/material';
import React, { useContext } from 'react';
import { AuthContext } from '../../Contexts/UserAuthProvider';
import NotificationsMenu from '../NotificationsMenu/NotificationsMenu';

const DashboardNav = ({ isAdmin }) => {
	const { user } = useContext(AuthContext);

	
	return (
		<div>
			<nav className="bg-white h-[70px] hidden md:block">
				<div>
					<div className="flex h-[70px] items-center justify-end ">
						<div className="mr-4">{isAdmin && <NotificationsMenu />}</div>
						{user?.photoURL ? (
							<img
								className="object-cover w-12 h-12 mx-2 rounded-full"
								src={user?.photoURL}
								alt="avatar"
							/>
						) : (
							<Avatar>
								<AccountCircleIcon />
							</Avatar>
						)}

						<div>
							<h4 className="mx-2  font-medium text-gray-800 ">{user?.displayName}</h4>
							<p className="mx-2 text-sm font-medium text-gray-600 ">{user?.email}</p>
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default DashboardNav;
