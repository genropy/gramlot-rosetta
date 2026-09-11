import React from 'react';
import {createRoot} from 'react-dom/client';
import {config, pages} from 'virtual:application';

function Index() {
  return <nav aria-label="Pages"><ul>{Object.entries(config.pages).map(([name, page]) =>
    <li key={name}><a href={`${config.prefix}/${name}/`}>{page.label}</a></li>
  )}</ul></nav>;
}

const name = decodeURIComponent(window.location.pathname.slice(config.prefix.length)).replace(/^\/|\/$/g, '');
const Page = name ? pages[name] : Index;
document.title = config.title;
createRoot(document.getElementById('root')).render(Page ? <Page/> : <h1>Page not found</h1>);
