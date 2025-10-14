import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import {colorTheme} from './colorTheme'
import React from 'react'

const AppTheme = ({children}) => {
  return (
    <ThemeProvider theme={colorTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline/>
      {/* <App /> */}
      {children}
    </ThemeProvider>
  )
}

export default AppTheme