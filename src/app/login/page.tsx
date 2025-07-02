import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left section with logo and background */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        {/* Image with responsive sizing */}
        <img
          src="/lost-image.png"
          alt="Illustration"
          className="max-w-full max-h-full object-contain p-4"
        />
      </div>

      {/* Right section with login form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-black-900 mb-12 text-center uppercase">Welcome back!</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}