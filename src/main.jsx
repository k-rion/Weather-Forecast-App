
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

(function () {
  try {
    const t = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute('data-theme', t === "dark" ? "forest" : "light");
  } catch (e) {
    console.log(e);
  }
})();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
