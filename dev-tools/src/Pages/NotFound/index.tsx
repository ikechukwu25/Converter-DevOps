import LandingPageLayout from '@/components/LandingPageLayout'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LandingPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-400/20 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-9xl font-extrabold animate-bounce text-destructive">404</h1>
            <h2 className="mt-6 text-3xl font-bold text-slate-900">Oops! Page not found</h2>
            <p className="mt-2 text-lg text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
          </div>
          <div className="mt-8">
            <Link to="/">
              <Button className="inline-flex items-center h-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 transition-colors duration-300">
                Go back home
                <MoveRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  )
}
