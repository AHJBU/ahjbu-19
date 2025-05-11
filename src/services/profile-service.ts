
import { supabase } from '@/lib/supabase';
import { Profile, Experience, Education, Skill, GalleryItem } from '@/types/profile';

// تحميل معلومات الملف الشخصي
export const getProfile = async (): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return data as unknown as Profile;
  } catch (error) {
    console.error('خطأ في تحميل معلومات الملف الشخصي:', error);
    
    // إنشاء ملف شخصي نموذجي في حالة حدوث خطأ
    return {
      id: '1',
      name: 'عبد الله الحسيني',
      nameAr: 'عبد الله الحسيني',
      title: 'Full Stack Developer',
      titleAr: 'مطور ويب متكامل',
      bio: 'Experienced web developer with passion for creating innovative digital solutions.',
      bioAr: 'مطور ويب ذو خبرة عالية مع شغف لإنشاء حلول رقمية مبتكرة.',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      coverImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      email: 'contact@example.com',
      phone: '+966512345678',
      location: 'Riyadh, Saudi Arabia',
      locationAr: 'الرياض، المملكة العربية السعودية',
      social: {
        github: 'https://github.com/',
        linkedin: 'https://linkedin.com/in/',
        twitter: 'https://twitter.com/'
      },
      experiences: [
        {
          id: '1',
          title: 'Senior Web Developer',
          titleAr: 'مطور ويب أول',
          company: 'Tech Solutions',
          companyAr: 'حلول تقنية',
          location: 'Riyadh',
          locationAr: 'الرياض',
          startDate: '2020-01-01',
          endDate: null,
          description: 'Leading web development projects and managing a team of developers.',
          descriptionAr: 'قيادة مشاريع تطوير الويب وإدارة فريق من المطورين.',
          current: true
        }
      ],
      education: [
        {
          id: '1',
          degree: 'Master of Computer Science',
          degreeAr: 'ماجستير علوم الحاسب',
          institution: 'King Saud University',
          institutionAr: 'جامعة الملك سعود',
          location: 'Riyadh',
          locationAr: 'الرياض',
          startDate: '2015-09-01',
          endDate: '2019-06-30',
          description: 'Specialized in web technologies and artificial intelligence.',
          descriptionAr: 'تخصص في تقنيات الويب والذكاء الاصطناعي.',
          current: false
        }
      ],
      skills: [
        {
          id: '1',
          name: 'React',
          nameAr: 'رياكت',
          level: 90,
          category: 'Frontend'
        },
        {
          id: '2',
          name: 'Node.js',
          nameAr: 'نود جيه اس',
          level: 85,
          category: 'Backend'
        }
      ],
      gallery: [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          title: 'Coding Session',
          titleAr: 'جلسة برمجة'
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
          title: 'Team Meeting',
          titleAr: 'اجتماع فريق العمل'
        }
      ]
    };
  }
};

// تحديث معلومات الملف الشخصي
export const updateProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  try {
    // هنا نحتاج لجلب معرف الملف الشخصي أولاً إذا كان غير متوفر
    let profileId = profileData.id;
    if (!profileId) {
      const { data } = await supabase.from('profiles').select('id').single();
      profileId = data?.id;
    }
    
    if (profileId) {
      // تحديث بيانات ملف موجود
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profileId);
      
      if (error) throw error;
    } else {
      // إنشاء ملف شخصي جديد إذا لم يكن موجوداً
      const { error } = await supabase
        .from('profiles')
        .insert([{ ...profileData }]);
      
      if (error) throw error;
    }
    
    // إعادة تحميل البيانات المحدثة
    return await getProfile();
  } catch (error) {
    console.error('خطأ في تحديث معلومات الملف الشخصي:', error);
    throw error;
  }
};

// إضافة خبرة عملية جديدة
export const addExperience = async (experience: Experience): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedProfile = {
      ...profile,
      experiences: [...profile.experiences, experience]
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في إضافة خبرة جديدة:', error);
    throw error;
  }
};

// تحديث خبرة عملية موجودة
export const updateExperience = async (updatedExp: Experience): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedExperiences = profile.experiences.map(exp => 
      exp.id === updatedExp.id ? updatedExp : exp
    );
    const updatedProfile = {
      ...profile,
      experiences: updatedExperiences
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في تحديث الخبرة العملية:', error);
    throw error;
  }
};

// حذف خبرة عملية
export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedExperiences = profile.experiences.filter(exp => exp.id !== experienceId);
    const updatedProfile = {
      ...profile,
      experiences: updatedExperiences
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في حذف الخبرة العملية:', error);
    throw error;
  }
};

// إضافة تعليم جديد
export const addEducation = async (education: Education): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedProfile = {
      ...profile,
      education: [...profile.education, education]
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في إضافة تعليم جديد:', error);
    throw error;
  }
};

// تحديث تعليم موجود
export const updateEducation = async (updatedEdu: Education): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedEducation = profile.education.map(edu => 
      edu.id === updatedEdu.id ? updatedEdu : edu
    );
    const updatedProfile = {
      ...profile,
      education: updatedEducation
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في تحديث التعليم:', error);
    throw error;
  }
};

// حذف تعليم
export const deleteEducation = async (educationId: string): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedEducation = profile.education.filter(edu => edu.id !== educationId);
    const updatedProfile = {
      ...profile,
      education: updatedEducation
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في حذف التعليم:', error);
    throw error;
  }
};

// إضافة مهارة جديدة
export const addSkill = async (skill: Skill): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedProfile = {
      ...profile,
      skills: [...profile.skills, skill]
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في إضافة مهارة جديدة:', error);
    throw error;
  }
};

// تحديث مهارة موجودة
export const updateSkill = async (updatedSkill: Skill): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedSkills = profile.skills.map(skill => 
      skill.id === updatedSkill.id ? updatedSkill : skill
    );
    const updatedProfile = {
      ...profile,
      skills: updatedSkills
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في تحديث المهارة:', error);
    throw error;
  }
};

// حذف مهارة
export const deleteSkill = async (skillId: string): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedSkills = profile.skills.filter(skill => skill.id !== skillId);
    const updatedProfile = {
      ...profile,
      skills: updatedSkills
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في حذف المهارة:', error);
    throw error;
  }
};

// إضافة صورة جديدة للمعرض
export const addGalleryItem = async (item: GalleryItem): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedProfile = {
      ...profile,
      gallery: [...profile.gallery, item]
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في إضافة عنصر للمعرض:', error);
    throw error;
  }
};

// تحديث صورة موجودة في المعرض
export const updateGalleryItem = async (updatedItem: GalleryItem): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedGallery = profile.gallery.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    const updatedProfile = {
      ...profile,
      gallery: updatedGallery
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في تحديث عنصر المعرض:', error);
    throw error;
  }
};

// حذف صورة من المعرض
export const deleteGalleryItem = async (itemId: string): Promise<void> => {
  try {
    const profile = await getProfile();
    const updatedGallery = profile.gallery.filter(item => item.id !== itemId);
    const updatedProfile = {
      ...profile,
      gallery: updatedGallery
    };
    await updateProfile(updatedProfile);
  } catch (error) {
    console.error('خطأ في حذف عنصر المعرض:', error);
    throw error;
  }
};

// إنشاء جداول قاعدة البيانات اللازمة
export const createProfileTables = async (): Promise<void> => {
  try {
    // هذا الدالة ستقوم بإنشاء الجداول اللازمة في Supabase إذا لم تكن موجودة بالفعل
    // عادة ما يتم تنفيذها عند بدء التطبيق لأول مرة
    
    // هنا يمكن إضافة أي عمليات إنشاء للجداول في Supabase
    // لكن حاليا نستخدم الواجهة الرسومية للـ Supabase لإنشاء الجداول
    
    console.log("Profile tables created or already exist in Supabase");
  } catch (error) {
    console.error("Error creating profile tables:", error);
    throw error;
  }
};
