import { type RouteObject, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminServices from '@/pages/admin/Services';
import AdminBlog from '@/pages/admin/Blog';
import AdminNews from '@/pages/admin/News';
import AdminSettings from '@/pages/admin/Settings';
import AdminContact from '@/pages/admin/Contact';
import NotFound from '@/pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:slug', element: <ServiceDetail /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogDetail /> },
      { path: 'news', element: <News /> },
      { path: 'news/:slug', element: <NewsDetail /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'blog', element: <AdminBlog /> },
      { path: 'news', element: <AdminNews /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: 'contact', element: <AdminContact /> },
    ],
  },
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <Navigate to="/404" replace /> },
];
