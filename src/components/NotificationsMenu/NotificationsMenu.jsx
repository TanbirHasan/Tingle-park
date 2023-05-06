import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Alert, Button, IconButton } from '@mui/material';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { purple } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'react-hot-toast';
import { baseUrl } from '../../baseURL';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const NotificationsMenu = () => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const { data: notifications = [], refetch, isLoading, isPreviousData } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const res = await fetch(`${baseUrl}/notifications`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
				},
			});
			const result = await res.json();

			return result;
		},
	});

	const handleDeleteSingleNotification = (notification) => {
		fetch(`${baseUrl}/notifications/${notification._id}`, {
			method: 'DELETE',
			headers: {
				authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				toast.success('Notification seen');
				refetch();
			});
	};

	const handleDeleteAllNotifications = () => {
		fetch(`${baseUrl}/notifications/delete/notifications`, {
			method: 'DELETE',
		})
			.then((res) => res.json())
			.then((data) => {
				toast.success('Notifications cleared all');
				refetch();
				setAnchorEl(null);
			});
	};

	return (
		<div className="">
			<>
				<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
					<Tooltip arrow title="Notifications">
						<IconButton
							className={'MyCustomButton'}
							onClick={handleClick}
							sx={{ ml: 2 }}
							aria-controls={open ? 'account-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							size="large"
							aria-label="notifications"
						>
							<Badge
								invisible={notifications.length === 0 ? true : false}
								color="secondary"
								className="notification-pulse"
								variant="dot"
							>
								<NotificationsNoneOutlinedIcon sx={{ color: purple[500] }} fontSize="inherit" />
							</Badge>
						</IconButton>
					</Tooltip>
				</Box>
				<Menu
					anchorEl={anchorEl}
					id="account-menu"
					open={open}
					onClose={handleClose}
					// onClick={handleClose}
					PaperProps={{
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				>
					{notifications.length === 0 ? (
						<MenuItem
							sx={{
								'&.MuiButtonBase-root:hover': {
									bgcolor: 'transparent',
								},
							}}
							disableElevation
							disableRipple
						>
							No notifications
						</MenuItem>
					) : (
						<Box>
							<MenuItem
								sx={{
									'&.MuiButtonBase-root:hover': {
										bgcolor: 'transparent',
									},
									display: 'flex',
									justifyContent: 'end',
								}}
								disableElevation
								disableRipple
							>
								<div className="">
									<Button color="error" variant="outlined" onClick={handleDeleteAllNotifications}>
										Clear All
									</Button>
								</div>
							</MenuItem>
							{notifications?.map((notification) => (
								<MenuItem
									key={notification._id}
									sx={{
										'&.MuiButtonBase-root:hover': {
											bgcolor: 'transparent',
										},
										p: 0,
										m: 1,
									}}
									disableElevation
									disableRipple
								>
									<Alert
										severity="info"
										icon={false}
										sx={{
											'&.MuiButtonBase-root:hover': {
												bgcolor: 'transparent',
											},
											width: '100%',
										}}
										disableElevation
										disableRipple
									>
										<div className="flex items-center justify-between gap-10 w-[500px] ">
											<div className="gap-4">
												<p className="flex-wrap text-md">{notification.notificationMessage}</p>
												{/* <p className="flex-wrap text-xs">{notification.sentTime}</p> */}
												<p className="flex-wrap text-xs">
													{formatDistanceToNow(new Date(notification.createdAt), {
														addSuffix: true,
													})}
												</p>
											</div>
											{/* <Tooltip title="Delete notification"> */}
											<IconButton
												onClick={() => handleDeleteSingleNotification(notification)}
												color="info"
												aria-label="delete notification"
											>
												<CancelOutlinedIcon color="error" />
											</IconButton>
											{/* </Tooltip> */}
										</div>
									</Alert>
								</MenuItem>
							))}
						</Box>
					)}
				</Menu>
			</>
		</div>
	);
};

export default NotificationsMenu;
