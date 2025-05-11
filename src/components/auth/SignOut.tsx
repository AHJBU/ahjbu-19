
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/context/LanguageContext'
import { LogOut } from 'lucide-react'

export function SignOut() {
  const { language } = useLanguage()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: language === 'en' ? 'Signed out' : 'تم تسجيل الخروج',
        description: language === 'en' ? 'You have been signed out successfully.' : 'تم تسجيل خروجك بنجاح.',
      })
      
      // Redirect to home page
      window.location.href = '/'
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: error.message || (language === 'en' ? 'An error occurred while signing out.' : 'حدث خطأ أثناء تسجيل الخروج.'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
    </Button>
  )
}
