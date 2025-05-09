
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Setup listener for window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    window.addEventListener('resize', handleResize)
    
    // Also use matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } 
    // Older browsers
    else if ('addListener' in mql) {
      // @ts-ignore - For older browsers
      mql.addListener(onChange)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } 
      else if ('removeListener' in mql) {
        // @ts-ignore - For older browsers
        mql.removeListener(onChange)
      }
    }
  }, [])

  // Return false as fallback if undefined
  return isMobile === undefined ? false : isMobile
}
