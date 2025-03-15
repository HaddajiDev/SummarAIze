import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.scss'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'

// Antd Theme
const componentsTheme = {
  "Spin": {
    "colorPrimary": "rgb(255,255,255)"
  }
}

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ConfigProvider
      theme={{
        components: componentsTheme,
        token: {
          "colorPrimary": "#7065ef",
          "colorInfo": "#7065ef",
          "borderRadius": 3
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  // </StrictMode>,
)
