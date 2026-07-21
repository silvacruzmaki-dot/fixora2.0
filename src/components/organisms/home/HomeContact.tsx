"use client";

import Link from "next/link";

import {
  FiArrowRight,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
} from "react-icons/fi";

import type { IconType } from "react-icons";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import type { HomeIconContainerVariant } from "@/components/atoms/home/HomeIconContainer";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import ContactItem from "@/components/molecules/home/ContactItem";
import useLanguage from "@/hooks/language/useLanguage";

type ContactChannelId =
  | "email"
  | "phone"
  | "whatsapp"
  | "location";

interface ContactChannel {
  id: ContactChannelId;
  value: string;
  href?: string;
  openInNewTab?: boolean;
}

interface HomeContactContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  channelLabels: Record<ContactChannelId, string>;
  contactButton: string;
  contactButtonAriaLabel: string;
  whatsappButton: string;
  whatsappButtonAriaLabel: string;
  unavailableMessage: string;
}

const HOME_CONTACT_COPY: Record<
  "es" | "en",
  HomeContactContent
> = {
  es: {
    badge: "Estamos para ayudarte",

    title: "Conversemos sobre tu próxima",

    highlightedTitle: "solución tecnológica",

    description:
      "Escríbenos para recibir información, resolver tus dudas o contarnos el proyecto que deseas desarrollar con FIXORA.",

    channelLabels: {
      email: "Correo electrónico",
      phone: "Teléfono",
      whatsapp: "WhatsApp",
      location: "Ubicación",
    },

    contactButton: "Ir a contacto",

    contactButtonAriaLabel:
      "Ir a la página de contacto de FIXORA",

    whatsappButton: "Escribir por WhatsApp",

    whatsappButtonAriaLabel:
      "Iniciar una conversación con FIXORA por WhatsApp",

    unavailableMessage:
      "Los canales de atención serán publicados próximamente.",
  },

  en: {
    badge: "We are here to help",

    title: "Let’s talk about your next",

    highlightedTitle: "technology solution",

    description:
      "Contact us to request information, ask questions, or tell us about the project you would like to develop with FIXORA.",

    channelLabels: {
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      location: "Location",
    },

    contactButton: "Go to contact",

    contactButtonAriaLabel:
      "Go to the FIXORA contact page",

    whatsappButton: "Message us on WhatsApp",

    whatsappButtonAriaLabel:
      "Start a WhatsApp conversation with FIXORA",

    unavailableMessage:
      "Our contact channels will be available soon.",
  },
};

const CONTACT_ICONS: Record<
  ContactChannelId,
  IconType
> = {
  email: FiMail,
  phone: FiPhone,
  whatsapp: FiMessageCircle,
  location: FiMapPin,
};

const CONTACT_VARIANTS: Record<
  ContactChannelId,
  HomeIconContainerVariant
> = {
  email: "blue",
  phone: "violet",
  whatsapp: "green",
  location: "orange",
};

function normalizePhoneNumber(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export default function HomeContact() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_CONTACT_COPY.en
      : HOME_CONTACT_COPY.es;

  const email =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

  const phone =
    process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() ?? "";

  const whatsapp =
    process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.trim() ?? "";

  const location =
    process.env.NEXT_PUBLIC_CONTACT_LOCATION?.trim() ?? "";

  const locationUrl =
    process.env.NEXT_PUBLIC_CONTACT_LOCATION_URL?.trim() ??
    "";

  const normalizedWhatsApp =
    normalizeWhatsAppNumber(whatsapp);

  const whatsappHref = normalizedWhatsApp
    ? `https://wa.me/${normalizedWhatsApp}`
    : "";

  const allContactChannels: ContactChannel[] = [
    {
      id: "email",
      value: email,
      ...(email
        ? {
            href: `mailto:${email}`,
          }
        : {}),
    },

    {
      id: "phone",
      value: phone,
      ...(phone
        ? {
            href: `tel:${normalizePhoneNumber(phone)}`,
          }
        : {}),
    },

    {
      id: "whatsapp",
      value: whatsapp,
      ...(whatsappHref
        ? {
            href: whatsappHref,
            openInNewTab: true,
          }
        : {}),
    },

    {
      id: "location",
      value: location,
      ...(locationUrl
        ? {
            href: locationUrl,
            openInNewTab: true,
          }
        : {}),
    },
  ];

  const contactChannels = allContactChannels.filter(
    (channel) => channel.value.length > 0,
  );

  return (
    <section
      id="contacto-inicio"
      aria-labelledby="home-contact-title"
      className={[
        "relative isolate overflow-hidden",
        "bg-white px-4 py-16",
        "transition-colors duration-300",
        "dark:bg-slate-900",
        "sm:px-6 sm:py-20",
        "lg:px-8 lg:py-24",
      ].join(" ")}
    >
      <HomeDecorativeShape
        variant="blue"
        size="large"
        form="circle"
        className="-left-32 top-16 opacity-40"
      />

      <HomeDecorativeShape
        variant="green"
        size="medium"
        form="blob"
        className="-right-20 bottom-16 opacity-40"
      />

      <HomeDecorativeShape
        variant="orange"
        size="small"
        form="ring"
        blurred={false}
        className="right-[8%] top-10 hidden opacity-60 lg:block"
      />

      <div
        className={[
          "relative z-10 mx-auto grid w-full",
          "max-w-[1180px]",
          "grid-cols-1 items-start gap-10",
          "lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,1.05fr)]",
          "lg:gap-14",
          "xl:gap-20",
        ].join(" ")}
      >
        <div className="min-w-0">
          <HomeBadge
            variant="brand"
            icon={
              <FiSend
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            }
          >
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-contact-title"
            as="h2"
            size="section"
            align="left"
            highlightedText={copy.highlightedTitle}
            className="mt-5"
          >
            {copy.title}
          </HomeSectionTitle>

          <HomeSectionDescription
            size="section"
            align="left"
            className="mt-5"
          >
            {copy.description}
          </HomeSectionDescription>

          <div
            className={[
              "mt-8 flex w-full flex-col gap-3",
              "sm:w-auto sm:flex-row sm:flex-wrap",
            ].join(" ")}
          >
            <Link
              href="/contacto"
              aria-label={copy.contactButtonAriaLabel}
              className={[
                "group inline-flex min-h-12 w-full",
                "items-center justify-center gap-2.5",
                "rounded-full",
                "bg-fixora-green-strong",
                "px-6 py-3",
                "text-sm font-semibold text-white",
                "shadow-fixora-soft",
                "transition-all duration-300",
                "hover:-translate-y-0.5",
                "hover:bg-fixora-green-hover",
                "hover:shadow-fixora-hover",
                "focus-visible:outline-none",
                "focus-visible:ring-4",
                "focus-visible:ring-fixora-focus/25",
                "sm:w-auto",
              ].join(" ")}
            >
              <span>{copy.contactButton}</span>

              <FiArrowRight
                aria-hidden="true"
                className={[
                  "h-4 w-4",
                  "transition-transform duration-300",
                  "group-hover:translate-x-1",
                ].join(" ")}
              />
            </Link>

            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={copy.whatsappButtonAriaLabel}
                className={[
                  "group inline-flex min-h-12 w-full",
                  "items-center justify-center gap-2.5",
                  "rounded-full border",
                  "border-emerald-500/25",
                  "bg-emerald-500/10",
                  "px-6 py-3",
                  "text-sm font-semibold",
                  "text-emerald-700",
                  "shadow-sm",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:border-emerald-500/40",
                  "hover:bg-emerald-500/15",
                  "hover:shadow-lg",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-emerald-500/20",
                  "dark:border-emerald-400/20",
                  "dark:bg-emerald-400/10",
                  "dark:text-emerald-300",
                  "dark:hover:border-emerald-400/35",
                  "dark:hover:bg-emerald-400/15",
                  "sm:w-auto",
                ].join(" ")}
              >
                <FiMessageCircle
                  aria-hidden="true"
                  className="h-4 w-4"
                />

                <span>{copy.whatsappButton}</span>
              </a>
            ) : null}
          </div>
        </div>

        <div
          className={[
            "relative overflow-hidden",
            "rounded-[2rem] border",
            "border-slate-200/80",
            "bg-slate-50/80 p-5",
            "shadow-xl shadow-slate-950/5",
            "backdrop-blur-xl",
            "transition-colors duration-300",
            "dark:border-white/10",
            "dark:bg-slate-950/55",
            "dark:shadow-black/20",
            "sm:p-6",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute",
              "-right-16 -top-16",
              "h-48 w-48 rounded-full",
              "bg-cyan-400/10 blur-3xl",
              "dark:bg-cyan-300/10",
            ].join(" ")}
          />

          {contactChannels.length > 0 ? (
            <div className="relative z-10 grid grid-cols-1 gap-4">
              {contactChannels.map((channel) => {
                const Icon = CONTACT_ICONS[channel.id];

                const optionalContactProps = {
                  ...(channel.href
                    ? {
                        href: channel.href,
                      }
                    : {}),

                  ...(channel.openInNewTab !== undefined
                    ? {
                        openInNewTab:
                          channel.openInNewTab,
                      }
                    : {}),
                };

                return (
                  <ContactItem
                    key={channel.id}
                    icon={
                      <Icon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    }
                    label={
                      copy.channelLabels[channel.id]
                    }
                    value={channel.value}
                    variant={
                      CONTACT_VARIANTS[channel.id]
                    }
                    linkAriaLabel={`${copy.channelLabels[channel.id]}: ${channel.value}`}
                    {...optionalContactProps}
                  />
                );
              })}
            </div>
          ) : (
            <div
              className={[
                "relative z-10 flex min-h-52",
                "flex-col items-center justify-center",
                "rounded-2xl border border-dashed",
                "border-slate-300",
                "px-5 py-10 text-center",
                "dark:border-slate-700",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "inline-flex h-14 w-14",
                  "items-center justify-center",
                  "rounded-2xl",
                  "bg-cyan-500/10",
                  "text-cyan-700",
                  "dark:bg-cyan-400/10",
                  "dark:text-cyan-300",
                ].join(" ")}
              >
                <FiMessageCircle className="h-6 w-6" />
              </span>

              <p
                className={[
                  "mt-4 max-w-sm",
                  "text-sm leading-relaxed",
                  "text-slate-600",
                  "dark:text-slate-300",
                  "sm:text-base",
                ].join(" ")}
              >
                {copy.unavailableMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}