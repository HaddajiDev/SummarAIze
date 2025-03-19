import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.scss'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd'

// Antd Theme
const componentsTheme = {
  "Spin": {
    "colorPrimary": "rgb(255,255,255)"
  },
  "Input": {
    "inputFontSize": 13,
    "paddingBlock": 7
  },
  "Modal": {
    "titleColor": "rgb(112,101,239)",
    "titleFontSize": 20,
    "lineHeight": 1.3
  },
  "Button": {
    "colorPrimary": "rgb(112,101,239)",
    "colorPrimaryHover": "rgb(81,68,230)",
    "colorPrimaryTextActive": "rgb(112,101,239)",
    "colorPrimaryActive": "rgb(112,101,239)",
    "colorPrimaryTextHover": "rgb(112,101,239)",
    "colorPrimaryBorder": "rgba(112,101,239,0.67)",
    "colorPrimaryBgHover": "rgba(112,101,239,0.54)",
    "colorPrimaryBg": "rgba(112,101,239,0.62)",
    "colorLinkHover": "rgba(112,101,239,0.61)",
    "colorLinkActive": "rgb(81,68,230)",
    "colorLink": "rgb(112,101,239)",
    "groupBorderColor": "rgba(112,101,239,0.68)",
    "defaultHoverColor": "rgb(112,101,239)",
    "defaultHoverBorderColor": "rgb(112,101,239)",
    "defaultActiveBorderColor": "rgb(75,65,193)",
    "defaultActiveColor": "rgb(89,77,217)",
    "paddingInline": 20,
    "paddingBlock": 6
  },
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
