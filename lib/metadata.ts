import { Metadata } from "next";

export const sitematedata: Metadata = {
  metadataBase: new URL("https://mbg-adminpanel.vercel.app"),
  title: "MBG Admin Panel",
  description: "MBG Admin Panel yang untuk data mbg",

  keywords: ["MBG", "Admin Panel", "Dashboard", "Pendaftaran", "Laporan"],

  authors: [
    {
      name: "MBG Team",
      url: "https://mbg-adminpanel.vercel.app",
    },
  ],
  creator: "badan gizi nasioal",

  openGraph: {
    title: "MBG Admin Panel",
    description: "MBG Admin Panel yang untuk data mbg",
    url: "https://mbg-adminpanel.vercel.app",
    images: [
      {
        url: "https://iili.io/BM27dRj.png",
        width: 1200,
        height: 630,
        alt: "MBG Admin Panel",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  applicationName: "MBG Admin Panel",
  category: "Admin Panel Dashboard buat mbg",
};
