import React from 'react';
import {createRoot} from 'react-dom/client';
import Hello from './pages/Hello.jsx';
import Alfa from './pages/Alfa.jsx';
import Beta from './pages/Beta.jsx';
const pages = {hello: Hello, alfa: Alfa, beta: Beta};
function Index() {
  return <nav aria-label="Pagine"><ul>
    <li><a href="/page/hello/">Hello</a></li>
    <li><a href="/page/alfa/">Alfa</a></li>
    <li><a href="/page/beta/">Beta</a></li>
  </ul></nav>;
}
const name = window.location.pathname.split('/')[2];
const Page = name ? pages[name] : Index;
createRoot(document.getElementById('root')).render(Page ? <Page/> : <h1>Pagina non trovata</h1>);
