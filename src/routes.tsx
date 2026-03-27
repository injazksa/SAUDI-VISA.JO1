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
import VisaCalculator from '@/pages/tools/VisaCalculator';
import SaudiAccreditation from '@/pages/tools/SaudiAccreditation';
import SaudiAuth from '@/pages/tools/SaudiAuth';
import RequiredDocuments from '@/pages/tools/RequiredDocuments';
import ProfessionsDirectory from '@/pages/tools/ProfessionsDirectory';
import LegalPage from '@/pages/LegalPage';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminServices from '@/pages/admin/Services';
import AdminBlog from '@/pages/admin/Blog';
import AdminNews from '@/pages/admin/News';
import AdminSettings from '@/pages/admin/Settings';
import AdminContact from '@/pages/admin/Contact';
import AdminFaqs from '@/pages/admin/Faqs';
import AdminProfessions from '@/pages/admin/Professions';
import AdminUsers from '@/pages/admin/Users';
import AdminNationalities from '@/pages/admin/Nationalities';
import AdminTestimonials from '@/pages/admin/Testimonials';
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
      { path: 'tools/visa-calculator', element: <VisaCalculator /> },
      { path: 'tools/saudi-accreditation', element: <SaudiAccreditation /> },
      { path: 'tools/saudi-auth', element: <SaudiAuth /> },
      { path: 'tools/required-documents', element: <RequiredDocuments /> },
      { path: 'tools/professions', element: <ProfessionsDirectory /> },
      { path: 'legal/:slug', element: <LegalPage /> },
      { path: 'admin/login', element: <Login /> }, // Hidden login path
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
      { path: 'faqs', element: <AdminFaqs /> },
      { path: 'professions', element: <AdminProfessions /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'nationalities', element: <AdminNationalities /> },
      { path: 'testimonials', element: <AdminTestimonials /> },
    ],
  },
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <Navigate to="/404" replace /> },
];
