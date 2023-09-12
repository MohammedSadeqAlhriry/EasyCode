import { createApp } from 'vue'; // importing createApp function from Vue
import App from './App.vue'; // importing the main App component
import './registerServiceWorker'; // registering the service worker
import router from './router'; // importing the router
import store from './store'; // importing the global store
import "bootstrap/dist/css/bootstrap.min.css"; // importing Bootstrap CSS
import "bootstrap"; // importing Bootstrap JavaScript
import './assets/fontawesome-free-6.3.0-web/fontawesome-free-6.3.0-web/css/fontawesome.min.css'; // importing font awesome CSS
import './assets/fontawesome-free-6.3.0-web/fontawesome-free-6.3.0-web/css/all.min.css'; // importing all font awesome CSS
import './assets/css/main.css'; // importing custom CSS
import Pagination from 'v-pagination-3'; // importing the Pagination component

createApp(App)
  .use(store) // mounting the global store
  .use(router) // mounting the router
  .component('Pagination', Pagination) // registering the Pagination component
  .mount('#app'); // mounting the App component to the #app element
