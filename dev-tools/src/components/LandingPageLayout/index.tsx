import { Wrench } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
import { Link, useLocation } from 'react-router-dom';

interface ILandingPageLayout {
  children: React.ReactNode;
}

const LandingPageLayout = ({ children }: ILandingPageLayout) => {

  const location = useLocation();
  React.useEffect(() => {
    console.log({ location: location.pathname });
  }, [location.pathname]);

  return (
    <main>
      <header className='bg-slate-100/20 shadow-md shadow-slate-200'>
        <div className='container px-4 py-4'>
          <div className='flex items-center justify-between'>
            <Link to="/">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-slate-700 rounded-tr-md rounded-bl-md"><Wrench className="text-white w-3 h-3" /></span>
                <h3 className="text-xl font-semibold text-slate-700">NexTools</h3>
              </div>
            </Link>
            {/* <Button onClick={login}>Login / Signup</Button> */}
            {location.pathname === "/" && <a href="#start"><Button>Get Started</Button></a>}
          </div>
        </div>
      </header>
      <div className='min-h-[calc(100dvh-108px)]'>
        {children}
      </div>
      <footer className="bg-slate-800 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4 text-white text-xs">
            <p>&copy; {new Date().getFullYear()} NextTools. All rights reserved</p>
            <p>Made by <a href="https://techydna.vercel.app/" target="_blank">TechyDNA</a></p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default LandingPageLayout;
