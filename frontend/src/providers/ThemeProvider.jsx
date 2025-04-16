// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'

// const ThemeContext = createContext({
//   theme: 'light',
//   toggleTheme: () => null
// })

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('light')

//   const toggleTheme = () => {
//     if (theme === 'light') {
//       setTheme('dark')
//       document.documentElement.classList.add('dark')
//       localStorage.setItem('theme', 'dark')
//     } else {
//       setTheme('light')
//       document.documentElement.classList.remove('dark')
//       localStorage.setItem('theme', 'light')
//     }
//   }

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'light'
//     setTheme(savedTheme)
//     if (savedTheme === 'dark') {
//       document.documentElement.classList.add('dark')
//     }
//   }, [])

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => useContext(ThemeContext)


import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light', 
  toggleTheme: () => null
})

export const ThemeProvider = ({ children }) => {
  // Start with undefined to avoid flickering during initial load
  const [theme, setTheme] = useState(undefined)

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      setTheme('light')
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Run once on component mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    
    // Check for system preference if no saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Set initial theme based on saved preference or system preference
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    
    // Apply theme to document
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Only render children once theme has been determined to avoid flickering
  if (theme === undefined) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)