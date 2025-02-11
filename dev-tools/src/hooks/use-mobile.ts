import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 640; // You can adjust this value as needed

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};

export default useMobile;