import React from 'react';
import { Element } from 'react-scroll';
import { Link } from 'react-router-dom';
import contactImage from '../../../assets/contactImage.png';
import chatIcon from '../../../assets/chatIcon.png';
import emailIcon from '../../../assets/emailIcon.png';
import phoneIcon from '../../../assets/phoneIcon.png';
import locationIcon from '../../../assets/locationIcon.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
	return (
		<>
			<Element name='contact' />
			<Card className=' relative mx-4 my-6 text-white md:mx-14 bg-gradient-to-bl from-[#000715] from-20%  to-[#0A1172] to-100%'>
				<CardHeader>
					<CardTitle className='absolute -top-4 -left-2 bg-white text-blue-700 p-2 rounded-lg text-5xl md:text-6xl font-orbitron font-bold'>
						Get In Touch
					</CardTitle>
				</CardHeader>
				<CardContent className='mt-14 grid gap-8 md:grid-cols-2'>
					<div className='grid justify-center mt-14 gap-10'>
						<img
							src={contactImage}
							alt='contact image'
							className='w-full md:w-auto hidden md:block'
						/>

						<div className='flex items-center gap-2 my-10 md:mt-0'>
							<img src={chatIcon} alt='chat icon' className='' />{' '}
							<Link to='' className='underline'>
								Live Chat
							</Link>
						</div>
					</div>

					<article className='w-ful'>
						<div className='text-lg md:text-2xl'>
							<p className='font-normal my-2'>
								Reach out to us for any inquiries, feedback, or support needs.
							</p>
							<p className='font-light'>
								Need assistance? Our dedicated customer support team is here to
								help you with any questions or concerns.
							</p>
						</div>

						{/* NOTE CONTACT Form */}
						<form className='mt-10'>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7'>
								<Input
									className='bg-transparent border-white text-white placeholder:text-white/70'
									type='text'
									placeholder='Fullname'
								/>
								<Input
									className='bg-transparent border-white text-white placeholder:text-white/70'
									type='email'
									placeholder='Email Address'
								/>
								<Input
									className='bg-transparent border-white text-white placeholder:text-white/70'
									type='tel'
									placeholder='Contact Number'
								/>
								<Input
									className='bg-transparent border-white text-white placeholder:text-white/70'
									type='text'
									placeholder='Subject'
								/>
							</div>
							<Button className='my-6 bg-white text-black font-bold rounded-md p-2 md:mt-10'>
								Contact us
							</Button>
						</form>

						<CardContent className='mt-10'>
							<h3 className='font-bold text-2xl mb-5'>We're here to help!</h3>
							<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
								<div className='flex items-center gap-3'>
									<img src={phoneIcon} alt='Phone icon' />
									<p>Phone: +1-800-123-4567</p>
								</div>
								<div className='flex items-center gap-3'>
									<img src={locationIcon} alt='location icon' />
									<p>
										Address: 123 Logistics Lane, Suite 200, Shipping City, ST
										45678
									</p>
								</div>
								<div className='flex items-center gap-2'>
									<img src={emailIcon} alt='email icon' />
									<p>Email: support@ziplogistics.com</p>
								</div>
							</div>
						</CardContent>
					</article>
				</CardContent>
			</Card>
		</>
	);
};

export default Contact;
