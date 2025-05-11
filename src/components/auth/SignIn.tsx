
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/context/LanguageContext'
import { Eye, EyeOff } from 'lucide-react'

export function SignIn() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: language === 'en' ? 'Welcome back!' : 'مرحبًا بعودتك!',
        description: language === 'en' ? 'You have successfully signed in.' : 'لقد قمت بتسجيل الدخول بنجاح.',
      })

      // Redirect to dashboard after successful login
      window.location.href = '/dashboard'
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: error.message || (language === 'en' ? 'An error occurred during sign in.' : 'حدث خطأ أثناء تسجيل الدخول.'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Sign In' : 'تسجيل الدخول'}</CardTitle>
        <CardDescription>
          {language === 'en' ? 'Enter your credentials to access your account.' : 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</Label>
            <Input
              id="email"
              type="email"
              placeholder={language === 'en' ? 'Email' : 'البريد الإلكتروني'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{language === 'en' ? 'Password' : 'كلمة المرور'}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={language === 'en' ? 'Password' : 'كلمة المرور'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {language === 'en' ? 'Signing in...' : 'جارٍ تسجيل الدخول...'}
              </span>
            ) : (
              language === 'en' ? 'Sign In' : 'تسجيل الدخول'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {language === 'en' ? 'Contact your administrator for account access.' : 'اتصل بالمسؤول للحصول على إمكانية الوصول إلى الحساب.'}
        </p>
      </CardFooter>
    </Card>
  )
}
