import type { Translations } from "@/types/language/language.types";

export const translations = {
  es: {
    navbar: {
      home: "Inicio",
      design: "Diseño",
      projects: "Proyectos",
      software: "Software",
      hardware: "Hardware",
      services: "Servicios",
      about: "Nosotros",
      contact: "Contacto",
      login: "Iniciar sesión",
    },

    navigation: {
      primary: "Navegación principal",
      mainOptions: "Opciones principales",
    },

    floatingMenu: {
      openMenu: "Abrir menú de configuración",
      closeMenu: "Cerrar menú de configuración",
      quickSettings: "Configuración rápida",
      lightMode: "Modo claro",
      darkMode: "Modo oscuro",
      changeToSpanish: "Cambiar a español",
      changeToEnglish: "Cambiar a inglés",
      language: "Idioma",
      settings: "Ajustes",
      notifications: "Notificaciones",
      profile: "Perfil",
      logout: "Cerrar sesión",
    },

    mobileNavigation: {
      openMenu: "Abrir menú de navegación",
      closeMenu: "Cerrar menú de navegación",
      navigationLabel: "Navegación móvil",
    },
  },

  en: {
    navbar: {
      home: "Home",
      design: "Design",
      projects: "Projects",
      software: "Software",
      hardware: "Hardware",
      services: "Services",
      about: "About us",
      contact: "Contact",
      login: "Sign in",
    },

    navigation: {
      primary: "Main navigation",
      mainOptions: "Main options",
    },

    floatingMenu: {
      openMenu: "Open settings menu",
      closeMenu: "Close settings menu",
      quickSettings: "Quick settings",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      changeToSpanish: "Switch to Spanish",
      changeToEnglish: "Switch to English",
      language: "Language",
      settings: "Settings",
      notifications: "Notifications",
      profile: "Profile",
      logout: "Sign out",
    },

    mobileNavigation: {
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      navigationLabel: "Mobile navigation",
    },
  },
} satisfies Translations;