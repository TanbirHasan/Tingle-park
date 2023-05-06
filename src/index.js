import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { Provider } from 'react-redux';
import App from './App';
import UserAuthProvider from './Contexts/UserAuthProvider';
import store from './app/store';
import './index.css';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<UserAuthProvider>
			<Provider store={store}>
				<ProSidebarProvider>
					<App />
					<Toaster
						toastOptions={{
							className: '',
							duration: 2500,
							style: {
								background: '#000000',
								color: '#fff',
							},
						}}
					/>
				</ProSidebarProvider>
			</Provider>
		</UserAuthProvider>
	</QueryClientProvider>
	// </React.StrictMode>
);

reportWebVitals();
