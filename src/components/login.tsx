'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StorageToken } from '@/types/response';
import { BackendFetch } from '@/commonds/fetch-api';
import { AuthResponse, UserLogin } from '@/types/auth';

type Props = {
  onLoginSuccess: () => void;
};

export const Login = ({ onLoginSuccess }: Props) => {
  
    const [formData, setFormData] = useState<UserLogin>({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMessage(null);
  
      try {
        const response = await BackendFetch<AuthResponse>("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(formData),
        });
  
        if (response.success && response.data?.access_token) {
          localStorage.setItem(StorageToken.ACCESS_TOKEN, response.data.access_token);
          onLoginSuccess();
        } else {
          setErrorMessage("Invalid email or password");
        }
      } catch (error) {
        console.log('error:', error)
        setErrorMessage("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white py-12 px-6 sm:px-8 rounded-lg shadow-xl">
          <div>
            <h2 className="text-center text-3xl font-semibold text-gray-800">Login to Restaurant App</h2>
          </div>
  
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
  
            {errorMessage && (
              <div className="text-red-600 bg-red-100 px-4 py-2 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
  
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </form>
  
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    );
  };
