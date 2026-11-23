import { Poppins, Nunito_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata = {
  title: "KursusDeh - Platform Kursus Online Ramah Segala Usia",
  description: "Platform kursus online yang sederhana, terstruktur, dan ramah untuk segala usia. Belajar skill baru selangkah demi selangkah.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-page text-text-main">
        {children}
      </body>
    </html>
  );
}
