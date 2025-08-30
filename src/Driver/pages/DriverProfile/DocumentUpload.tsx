import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import auth from '../../../../helper/authenticate';
import Delivery from '../../../assets/delivery-man.png';

// Define strict types for document fields and file types
type DocumentField =
	| 'driver_photo'
	| 'driver_liscence'
	| 'vehicle_inspection_report'
	| 'vehicle_insurance_policy';

interface DocumentConfig {
	field: DocumentField;
	label: string;
	accept: string;
	maxSizeMB: number;
	allowedTypes: string[];
}

interface UploadState {
	driver_photo: File | null;
	driver_liscence: File | null;
	vehicle_inspection_report: File | null;
	vehicle_insurance_policy: File | null;
}

interface UploadProgress {
	driver_photo: {
		progress: number;
		status: 'idle' | 'uploading' | 'completed' | 'error';
	};
	driver_liscence: {
		progress: number;
		status: 'idle' | 'uploading' | 'completed' | 'error';
	};
	vehicle_inspection_report: {
		progress: number;
		status: 'idle' | 'uploading' | 'completed' | 'error';
	};
	vehicle_insurance_policy: {
		progress: number;
		status: 'idle' | 'uploading' | 'completed' | 'error';
	};
}

const DOCUMENT_CONFIGS: DocumentConfig[] = [
	{
		field: 'driver_photo',
		label: "Driver's Photo",
		accept: 'image/jpeg,image/png',
		maxSizeMB: 5,
		allowedTypes: ['image/jpeg', 'image/png'],
	},
	{
		field: 'driver_liscence',
		label: "Driver's Licence",
		accept: 'application/pdf',
		maxSizeMB: 10,
		allowedTypes: ['application/pdf'],
	},
	{
		field: 'vehicle_inspection_report',
		label: 'Vehicle Inspection Report',
		accept: 'application/pdf',
		maxSizeMB: 10,
		allowedTypes: ['application/pdf'],
	},
	{
		field: 'vehicle_insurance_policy',
		label: 'Vehicle Insurance Policy',
		accept: 'application/pdf',
		maxSizeMB: 10,
		allowedTypes: ['application/pdf'],
	},
];

// Map frontend field names to backend field names
const FIELD_MAP: Record<DocumentField, string> = {
	driver_photo: 'profile_photo',
	driver_liscence: 'driver_license',
	vehicle_inspection_report: 'inspection_report',
	vehicle_insurance_policy: 'insurance_policy',
};

const DocumentUpload: React.FC = () => {
	const [uploadedFiles, setUploadedFiles] = useState<UploadState>({
		driver_photo: null,
		driver_liscence: null,
		vehicle_inspection_report: null,
		vehicle_insurance_policy: null,
	});

	const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
		driver_photo: { progress: 0, status: 'idle' },
		driver_liscence: { progress: 0, status: 'idle' },
		vehicle_inspection_report: { progress: 0, status: 'idle' },
		vehicle_insurance_policy: { progress: 0, status: 'idle' },
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [user_id, setUserId] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedDriverId = localStorage.getItem('driver_id');
		if (!storedDriverId) {
			setError('Not found. Please log in again.');
			return;
		}
		setUserId(storedDriverId);
	}, []);

	const validateFile = (file: File, config: DocumentConfig): string | null => {
		if (!config.allowedTypes.includes(file.type)) {
			return `Invalid file type. Please upload a ${config.allowedTypes.join(
				' or '
			)} file.`;
		}

		const fileSizeMB = file.size / (1024 * 1024);
		if (fileSizeMB > config.maxSizeMB) {
			return `File size exceeds ${config.maxSizeMB}MB limit.`;
		}

		return null;
	};

	const handleFileSelect = (field: DocumentField, file: File) => {
		const config = DOCUMENT_CONFIGS.find((c) => c.field === field);
		if (!config) {
			setError(`Invalid document type: ${field}`);
			return;
		}

		const validationError = validateFile(file, config);
		if (validationError) {
			setError(validationError);
			return;
		}

		setUploadedFiles((prev) => ({
			...prev,
			[field]: file,
		}));

		setUploadProgress((prev) => ({
			...prev,
			[field]: { progress: 0, status: 'idle' },
		}));

		setError(null);
	};

	const handleSubmitAllFiles = async () => {
		if (!user_id) {
			setError('No user ID available. Please log in again.');
			return;
		}

		const allFilesSelected = Object.values(uploadedFiles).every(
			(file) => file !== null
		);
		if (!allFilesSelected) {
			setError('Please upload all required documents');
			return;
		}

		const formData = new FormData();
		formData.append('user_id', user_id);

		// Use the FIELD_MAP to append files with correct backend field names
		(Object.keys(FIELD_MAP) as DocumentField[]).forEach((frontendField) => {
			const backendField = FIELD_MAP[frontendField];
			const file = uploadedFiles[frontendField];
			if (file) {
				formData.append(backendField, file);
			}
		});

		const URL = `https://ziplugs.geniusexcel.tech/api/upload-driver-documents`;

		try {
			setIsSubmitting(true);
			setError(null);

			const token = localStorage.getItem('access_token');
			const response = await fetch(URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token || ''}`,
				},
				body: formData,
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(
					responseData.message || `Upload failed with status: ${response.status}`
				);
			}

			if (responseData.driver?.id) {
				localStorage.setItem('driver_info_id', responseData.driver.id.toString());
				console.log('Saved driver_info_id to localStorage:', responseData.driver.id);
			} else {
				console.error('No driver.id in response:', responseData);
			}

			navigate('/payment-details');
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unexpected error occurred';
			setError(errorMessage);
			console.error('Upload failed:', errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex flex-col lg:flex-row items-center justify-center gap-8 p-6 bg-gray-100 min-h-screen'>
			{/* Left side - Image Section */}
			<div className='lg:w-1/2 flex justify-center items-center'>
				<div className='relative w-full max-w-lg'>
					<img
						src={Delivery}
						alt='Delivery driver with package'
						className='rounded-lg shadow-xl'
					/>
					<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 rounded-b-lg'>
						<h2 className='text-white text-2xl font-bold'>
							Join Our Delivery Team
						</h2>
						<p className='text-white/90 mt-2'>
							Complete your registration by uploading the required documents
						</p>
					</div>
				</div>
			</div>

			{/* Right side - Form Section */}
			<div className='lg:w-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-md'>
				<h1 className='text-2xl font-semibold mb-4 text-gray-800'>
					Upload Required Documents
				</h1>

				{error && (
					<div className='p-4 mb-4 bg-red-100 text-red-700 rounded-md border border-red-400'>
						<p className='font-medium'>Error</p>
						<p className='text-sm'>{error}</p>
					</div>
				)}

				{DOCUMENT_CONFIGS.map(({ field, label, accept }) => (
					<div key={field} className='mb-6'>
						<div className='flex justify-between items-center mb-2'>
							<label htmlFor={field} className='text-gray-700 font-medium'>
								{label}
							</label>
							{uploadedFiles[field] && (
								<span className='text-sm text-green-600'>
									File selected: {uploadedFiles[field]?.name}
								</span>
							)}
						</div>

						<div className='relative'>
							<input
								id={field}
								type='file'
								accept={accept}
								className='w-full p-2 border rounded-md text-sm file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) handleFileSelect(field, file);
								}}
								disabled={isSubmitting}
							/>

							{uploadProgress[field].status === 'uploading' && (
								<div className='mt-2 h-2 bg-gray-200 rounded-full overflow-hidden'>
									<div
										className='h-full bg-blue-600 transition-all duration-300'
										style={{ width: `${uploadProgress[field].progress}%` }}
									/>
								</div>
							)}
						</div>
					</div>
				))}

				<button
					onClick={handleSubmitAllFiles}
					disabled={
						!Object.values(uploadedFiles).every((file) => file !== null) ||
						isSubmitting
					}
					className={`w-full py-3 px-4 rounded-md font-medium text-white transition-all duration-300
            ${
							isSubmitting
								? 'bg-gray-400 cursor-not-allowed'
								: Object.values(uploadedFiles).every((file) => file !== null)
								? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
								: 'bg-gray-400 cursor-not-allowed'
						}`}>
					{isSubmitting ? (
						<span className='flex items-center justify-center'>
							<svg
								className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
							</svg>
							Uploading...
						</span>
					) : (
						'Upload All Documents'
					)}
				</button>
			</div>
		</div>
	);
};

export default DocumentUpload;
