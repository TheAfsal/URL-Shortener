import React, { useState, useEffect } from 'react';
import axios, {type AxiosInstance } from 'axios';
import type { User, Url } from './types.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [longUrl, setLongUrl] = useState<string>('');
  const [urls, setUrls] = useState<Url[]>([]);
  const [message, setMessage] = useState<string>('');

  const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: user ? { Authorization: `Bearer ${user.accessToken}` } : {},
  });

  const handleRegister = async (): Promise<void> => {
    try {
      await api.post('/auth/register', { email, password });
      setMessage('Registration successful! Please log in.');
    } catch (error: any) {
      setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await api.post<{ accessToken: string }>('/auth/login', { email, password });
      setUser(response.data);
      setMessage('Login successful!');
    } catch (error: any) {
      setMessage('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = (): void => {
    setUser(null);
    setUrls([]);
    setMessage('Logged out.');
  };

  const handleShorten = async (): Promise<void> => {
    try {
      const response = await api.post<Url>('/url/shorten', { longUrl });
      setUrls([...urls, response.data]);
      setMessage('URL shortened!');
    } catch (error: any) {
      setMessage('Shortening failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchUrls = async (): Promise<void> => {
    try {
      const response = await api.get<Url[]>('/url/my-urls');
      setUrls(response.data);
    } catch (error: any) {
      setMessage('Failed to fetch URLs: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    if (user) fetchUrls();
  }, [user]);

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>
        {message && <p className="text-red-500">{message}</p>}
        {!user ? (
            <div className="mb-4">
              <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="border p-2 mr-2"
              />
              <input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="border p-2 mr-2"
              />
              <button
                  onClick={handleRegister}
                  className="bg-blue-500 text-white p-2 mr-2"
              >
                Register
              </button>
              <button
                  onClick={handleLogin}
                  className="bg-green-500 text-white p-2"
              >
                Login
              </button>
            </div>
        ) : (
            <div>
              <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white p-2 mb-4"
              >
                Logout
              </button>
              <div className="mb-4">
                <input
                    type="text"
                    value={longUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLongUrl(e.target.value)}
                    placeholder="Enter URL to shorten"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={handleShorten}
                    className="bg-blue-500 text-white p-2"
                >
                  Shorten
                </button>
              </div>
              <h2 className="text-xl font-semibold">Your URLs</h2>
              <ul>
                {urls.map((url: Url) => (
                    <li key={url.shortCode}>
                      <a
                          href={`http://localhost:3000/api/url/${url.shortCode}`}
                          className="text-blue-500"
                      >
                        {`http://localhost:3000/api/url/${url.shortCode}`}
                      </a>
                      {' -> '}
                      {url.longUrl}
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default App;