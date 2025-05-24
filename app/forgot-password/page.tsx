import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { createClientServer } from "@/utils/supabase/server";

export default async function ForgotPasswordPage() {
  const supabase = await createClientServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="Ecole Ronsard Logo" width={150} height={90} className="object-contain" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Ecole Ronsard</h2>
          <p className="mt-2 text-lg font-medium text-blue-600">Reset Password</p>
          <p className="mt-1 text-base text-gray-600">Change your default password to continue</p>
        </div>
        <ForgotPasswordForm user={user} />
      </div>
    </div>
  );
}
