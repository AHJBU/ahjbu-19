
import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageDescription?: string;
}

const Layout = ({ children, pageTitle, pageDescription }: LayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95 dark:from-background dark:to-background/90">
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
