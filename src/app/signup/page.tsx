import SignupForm from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/signup-bg.png')" }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Join Lost2Cause</h1>
        <SignupForm />
      </div>
    </div>
  );
}