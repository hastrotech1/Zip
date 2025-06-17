import carImage from '../../../../src/assets/car.png';
import containerSmall from '../../../../src/assets/containersmall.png';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const SubHero = () => {
	return (
		<>
			<section className=' md:mt-1 md:flex'>
				<aside className='flex-1 grid justify-center gap-10 py-5 bg-gradient-to-t from-[#000715] from-40%  to-[#0A1172] to-100% text-white font-bold px-5 md:text-sm lg:text-xl'>
					<div className='gap-2 font-bold hidden md:flex items-center justify-center'>
						<p>Fast Delivery</p>
						<ArrowRightIcon />
						<p>Reliable Tracking</p>
						<ArrowRightIcon />
						<p>Secure Handling</p>
					</div>
					<div>
						<img src={carImage} alt='car image' className='w-full h-full' />
					</div>
				</aside>

				<aside className='flex-1 justify-center gap-10 pb-5 bg-gradient-to-t from-[#1320D8] from-70%  to-[#87CEEB] to-100% text-white font-bold  hidden md:grid md:text-sm md:px-7 lg:text-xl'>
					<div className='w-2/3'>
						<img src={containerSmall} alt='container small' />
					</div>

					<div className='space-y-2'>
						<h2>Ready to steamline your shipping?</h2>
						<p>
							Let Us Handle the Heavy Lifting While You Focus on What Matters.
						</p>
					</div>

					<div>
						<button className='bg-[#000715] text-white font-bold py-2 px-7 rounded-lg'>
							Zip it
						</button>
					</div>
				</aside>
			</section>
		</>
	);
};

export default SubHero;
