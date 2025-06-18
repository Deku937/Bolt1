'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.signup': 'Get Started',
    'nav.dashboard': 'Dashboard',
    
    // Hero Section
    'hero.title': 'Your Mental Health Journey Starts Here',
    'hero.subtitle': 'Connect with licensed professionals, track your progress, and access personalized support in a safe, judgment-free environment.',
    'hero.cta.primary': 'Start Your Journey',
    'hero.cta.secondary': 'Learn More',
    
    // Features
    'features.title': 'Comprehensive Mental Health Support',
    'features.subtitle': 'Everything you need to support your mental well-being',
    'features.professional.title': 'Licensed Professionals',
    'features.professional.desc': 'Connect with certified therapists and counselors',
    'features.tracking.title': 'Mood Tracking',
    'features.tracking.desc': 'Monitor your emotional well-being over time',
    'features.resources.title': 'Self-Help Resources',
    'features.resources.desc': 'Access guided meditations and wellness content',
    'features.secure.title': 'Secure & Private',
    'features.secure.desc': 'End-to-end encryption protects your privacy',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.try.again': 'Try again',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.finish': 'Finish',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.features': 'Fonctionnalités',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.signin': 'Se connecter',
    'nav.signup': 'Commencer',
    'nav.dashboard': 'Tableau de bord',
    
    // Hero Section
    'hero.title': 'Votre Parcours de Santé Mentale Commence Ici',
    'hero.subtitle': 'Connectez-vous avec des professionnels licenciés, suivez vos progrès et accédez à un soutien personnalisé dans un environnement sûr et sans jugement.',
    'hero.cta.primary': 'Commencer Votre Parcours',
    'hero.cta.secondary': 'En Savoir Plus',
    
    // Features
    'features.title': 'Soutien Complet en Santé Mentale',
    'features.subtitle': 'Tout ce dont vous avez besoin pour soutenir votre bien-être mental',
    'features.professional.title': 'Professionnels Licenciés',
    'features.professional.desc': 'Connectez-vous avec des thérapeutes et conseillers certifiés',
    'features.tracking.title': 'Suivi de l\'Humeur',
    'features.tracking.desc': 'Surveillez votre bien-être émotionnel au fil du temps',
    'features.resources.title': 'Ressources d\'Auto-Aide',
    'features.resources.desc': 'Accédez aux méditations guidées et contenu de bien-être',
    'features.secure.title': 'Sécurisé et Privé',
    'features.secure.desc': 'Le chiffrement de bout en bout protège votre vie privée',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Quelque chose s\'est mal passé',
    'common.try.again': 'Réessayer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.next': 'Suivant',
    'common.back': 'Retour',
    'common.finish': 'Terminer',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}