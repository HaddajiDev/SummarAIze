import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.scss'
import App from './App.jsx'
import { ConfigProvider } from 'antd'

// Antd Theme
const componentsTheme = {
 
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
      <App />
    </ConfigProvider>
  // </StrictMode>,
)
