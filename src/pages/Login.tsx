
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SignIn } from '@/components/auth/SignIn';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const { language } = useLanguage();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{language === 'en' ? 'Admin Login' : 'تسجيل دخول المسؤول'}</title>
      </Helmet>
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">
              {language === 'en' ? 'Admin Login' : 'تسجيل دخول المسؤول'}
            </h1>
            <SignIn />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
