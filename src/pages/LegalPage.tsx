import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { getLegalPageBySlug } from '@/db/api';
import { LegalPage as LegalPageType } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [page, setPage] = useState<LegalPageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await getLegalPageBySlug(slug);
      setPage(data);
      setLoading(false);
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 space-y-8">
        <Skeleton className="h-12 w-1/3 bg-muted" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-2/3 bg-muted" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Page Not Found</h2>
        <Link to="/">
          <Button variant="default" asChild><span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <section className="bg-primary py-16 text-white text-center">
         <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">{isRtl ? page.title_ar : page.title_en}</h1>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
         </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        <Link to="/">
           <Button variant="ghost" className="mb-8 flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground hover:text-primary" asChild>
             <span>
               {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
               <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
             </span>
           </Button>
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl border shadow-sm prose prose-primary max-w-none">
           <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8 text-primary">
              <ShieldCheck size={32} className="text-secondary" />
              <h2 className="text-2xl font-bold m-0">{isRtl ? page.title_ar : page.title_en}</h2>
           </div>
           
           <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
             {isRtl ? page.content_ar : page.content_en}
           </div>
           
           <div className="mt-12 pt-8 border-t text-sm text-muted-foreground">
              {isRtl ? "آخر تحديث: " : "Last updated: "}
              {new Date(page.updated_at).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
