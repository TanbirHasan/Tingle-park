import { useEffect, useState } from 'react';
import { baseUrl } from '../baseURL';

const useActiveUser = (email) => {
	const [isActiveUser, setIsActiveUser] = useState(false);
	const [isActiveUserLoading, setIsActiveUserLoading] = useState(true);

	useEffect(() => {
		if (email) {
			fetch(`${baseUrl}/users/active/${email}`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('minion-commerce-token')}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					setIsActiveUser(data.isAdmin);
					setIsActiveUserLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setIsActiveUserLoading(false);
				});
		}
	}, [email]);

	return [isActiveUser, isActiveUserLoading];
};

export default useActiveUser;
