import { createApp } from 'vue'
import App from './app'
import router from './app/providers/router'
import './shared/assets/styles/main.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
