import { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
	id: string;
	name: string;
	email: string;
}

interface UserContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch('/api/user');
				if (!response.ok) {
					throw new Error('Failed to fetch user');
				}
				const data: User = await response.json();
				setUser(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An unknown error occurred');
				}
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading, error }}>
			{children}
		</UserContext.Provider>
	);
};

export { UserProvider };
