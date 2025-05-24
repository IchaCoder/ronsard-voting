import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Ecole Ronsard Logo"
              width={200}
              height={120}
              className="object-contain"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Ecole Ronsard</h2>
          <p className="mt-2 text-lg font-medium text-blue-600">Student Voting Portal</p>
          <p className="mt-1 text-sm text-gray-600">Sign in to cast your vote</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
