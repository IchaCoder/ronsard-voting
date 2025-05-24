import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo.png"
              alt="Ecole Ronsard Logo"
              width={250}
              height={150}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Ecole Ronsard</h1>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Student Voting Portal</h2>
            <p className="text-lg text-gray-600">Participate in your school's democratic process</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>Cast your vote for student representatives</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button className="w-full">Login to Vote</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>Manage candidates and view results</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button variant="outline" className="w-full">
                    Admin Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">How to Vote</h3>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">
                  1
                </div>
                <p>Login with your credentials</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">
                  2
                </div>
                <p>Select candidates for each portfolio</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">
                  3
                </div>
                <p>Submit your votes securely</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
