import React from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router";
import DashboardLayout from "./layouts/dashboard/index.js";
import Home from "./components/Home.jsx";
import ArticleCreate from "./components/article/ArticleCreate.jsx";
import ArticleCreateByList from "./components/article/ArticleCreateByList.jsx";
import Article from "./components/article/Article.jsx";
import Articles from "./components/article/Articles.jsx";
import TypeCreate from "./components/type/TypeCreate.jsx";
import Type from "./components/type/Type.jsx";
import Types from "./components/type/Types.jsx";
import Sitemap from "./components/sitemap/Sitemap.jsx";
import Sitemaps from "./components/sitemap/Sitemaps.jsx";
import Profile from "./components/Profile.jsx";
import BoardUser from "./components/BoardUser.jsx";
import EditUser from "./components/EditUser.jsx";
import BoardModerator from "./components/BoardModerator.jsx";
import BoardAdmin from "./components/BoardAdmin.jsx";
import Login from "./components/Login.jsx";
import ScrollToTop from "./designComponents/scroll-to-top/index.js";
import {StyledChart} from "./designComponents/chart/index.jsx";
import {AxiosInterceptor} from "./utils/axiosInterceptor.jsx";
import CheckAuthProvider from "./components/CheckAuthProvider.jsx";
import ThemeProvider from "./theme/index.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from "./components/contact/Messages.jsx";

createRoot(document.getElementById('root')).render(
    <BrowserRouter basename={import.meta.env.VITE_APP_BASENAME}>
        <ThemeProvider>
        <ScrollToTop />
        <StyledChart />
        <CheckAuthProvider>
        <AxiosInterceptor>
                    <Routes>
                        <Route path="/" element={<DashboardLayout />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/article/create" element={<ArticleCreate />} />
                            <Route path="/article/createByList" element={<ArticleCreateByList />} />
                            <Route path="/article/:id" element={<Article />} />
                            <Route path="/articles/:type" element={<Articles />} />
                            <Route path="/articles" element={<Articles />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/type/create" element={<TypeCreate />} />
                            <Route path="/type/:id" element={<Type />} />
                            <Route path="/types" element={<Types />} />
                            <Route path="/sitemap/create" element={<Sitemap />} />
                            <Route path="/sitemap/:id" element={<Sitemap />} />
                            <Route path="/sitemaps" element={<Sitemaps />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/user" element={<BoardUser />} />
                            <Route path="/user/:id" element={<EditUser />} />
                            <Route path="/mod" element={<BoardModerator />} />
                            <Route path="/admin" element={<BoardAdmin />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                    </Routes>
        </AxiosInterceptor>
        </CheckAuthProvider>
        </ThemeProvider>
    </BrowserRouter>,
)
