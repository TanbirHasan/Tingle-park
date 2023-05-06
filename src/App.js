import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './routes/Routes/Routes';

import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

//! Short version steps
// const steps = [
// 	{
// 		id: '0',
// 		message: 'Hi, how can I help you?',
// 		// This calls the next id
// 		// i.e. id 1 in this case
// 		trigger: '1',
// 	},
// 	{
// 		id: '1',
// 		// This message appears in
// 		// the bot chat bubble
// 		user: true,
// 		trigger: '2',
// 	},
// 	{
// 		id: '2',
// 		// This message appears in
// 		// the bot chat bubble
// 		message: 'Please fill the contact form from contact page',
// 	},
// ];

//! Longer version steps
const steps = [
	{
		id: '1',
		message: 'What is your name?',
		trigger: '2',
	},
	{
		id: '2',
		user: true,
		trigger: '3',
	},
	{
		id: '3',
		message: 'Hi {previousValue}, nice to meet you!, How can I help you?',
		trigger: '4',
	},

	{
		id: '4',
		user: true,
		trigger: '5',
	},
	{
		id: '5',
		message: 'Did you fill the contact form yet',
		trigger: '6',
	},
	{
		id: '6',
		options: [
			{ value: 1, label: 'Yes', trigger: '7' },
			{ value: 2, label: 'No', trigger: '8' },
		],
	},

	{
		id: '7',
		message: 'Our Admin will get back to you soon. Thank you !',
		trigger: '1',
	},
	{
		id: '8',
		message: 'Please fill out the contact form from Contact page',
		trigger: '9',
	},
	{
		id: '9',
		message: 'And Admin will get back to you. Thank you !',
		trigger: '1',
	},
	// {
	// 	id: '7',
	// 	options: [
	// 		{ value: 1, label: 'Number 1', trigger: '4' },
	// 		{ value: 2, label: 'Number 2', trigger: '3' },
	// 		{ value: 3, label: 'Number 3', trigger: '3' },
	// 	],
	// },
];

// Creating our own theme
const theme = {
	background: '#f5f8fb',
	fontFamily: 'Poppins',
	headerBgColor: '#EF6C00',
	headerFontColor: '#fff',
	headerFontSize: '20px',
	botBubbleColor: '#EF6C00',
	botFontColor: '#fff',
	userBubbleColor: '#fff',
	userFontColor: '#4a4a4a',
};

// Set some properties of the bot
const config = {
	floating: true,
};

function App() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleButtonVisibility = () => {
			window.pageYOffset > 0 ? setVisible(true) : setVisible(false);
		};
		window.addEventListener('scroll', handleButtonVisibility);

		return () => {
			window.removeEventListener('scroll', handleButtonVisibility);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<div className="App bg-[#F5F5F5]">
			<ThemeProvider theme={theme}>
				<ChatBot
					// This appears as the header
					// text for the chat bot
					headerTitle="Ekopii"
					steps={steps}
					{...config}
				/>
			</ThemeProvider>
			{/* {visible && (
				<button
					className={`bounce scroll-button absolute z-50 ${visible ? 'text-box' : ''}`}
					onClick={scrollToTop}
					style={{
						position: 'fixed',
						bottom: '40px',
						right: '40px',
						width: '36px',
						height: '38px',
						backgroundColor: '#FFD333',
					}}
				>
					<FaAngleDoubleUp className="w-[30px] h-[20px] mx-auto text-black" />
				</button>
			)} */}

			<RouterProvider router={router} />
		</div>
	);
}

export default App;
