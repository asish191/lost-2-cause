'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ErrorModal from '@/components/common/ErrorModal';

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    passwordError: "",
    emailError: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setForm({ ...form, [e.target.name]: e.target.value, emailError: "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('[Signup] Form submit triggered with values:', form);
    e.preventDefault();
    setApiError("");
    // Pure email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      console.warn('[Signup] Invalid email:', form.email);
      setForm({ ...form, emailError: "Please enter a valid email address." });
      return;
    }
    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      console.warn('[Signup] Passwords do not match:', form.password, form.confirmPassword);
      setForm({ ...form, passwordError: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      const { register } = await import("@/services/authService");
      const payload = {
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
        first_name: form.firstName,
        last_name: form.lastName,
      };
      console.log('[Signup] Calling register API with payload:', payload);
      const response = await register(payload);
      console.log('[Signup] Register API response:', response);
      if (response.message === "Registration successful") {
        setShowSuccessModal(true);
      } else {
        setApiError(response.message || "Registration failed");
        console.error('[Signup] Registration failed:', response);
      }
    } catch (err: any) {
      setApiError(err.message || "Registration failed");
      console.error('[Signup] Exception during registration:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    // Placeholder for social signup logic
    console.log(`Signing up with ${provider}`);
  };

  return (
    <div className="space-y-6">
      {apiError && (
        <ErrorModal
          open={!!apiError}
          message={apiError}
          onClose={() => setApiError("")}
        />
      )}
      {showSuccessModal && (
        <ErrorModal
          open={showSuccessModal}
          message="User created"
          variant="success"
          onClose={() => {
            setShowSuccessModal(false);
            router.push('/login');
          }}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@student.epita.fr"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          {form.passwordError && (
            <p className="mt-1 text-sm text-red-600">{form.passwordError}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:text-green-700 font-medium transition-colors">
            Login here
          </a>
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSocialSignup('google')}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Google
        </button>
        <button
          onClick={() => handleSocialSignup('facebook')}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Image
            src="/facebook.svg"
            alt="Facebook"
            width={20}
            height={20}
            className="mr-2"
          />
          Facebook
        </button>
      </div>
    </div>
  );
}