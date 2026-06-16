import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="mb-8 text-center">
        <span className="text-4xl font-bold" style={{ color: '#1E3A5F' }}>MDX</span>
        <span className="text-4xl font-bold" style={{ color: '#F59E0B' }}>software</span>
        <p className="text-gray-500 mt-2 text-sm">Modexa Construction Management</p>
      </div>
      <SignUp />
    </div>
  )
}
