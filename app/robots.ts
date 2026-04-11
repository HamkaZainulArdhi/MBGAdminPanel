export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://mbg-adminpanel.vercel.app/sitemap.xml",
  };
}
