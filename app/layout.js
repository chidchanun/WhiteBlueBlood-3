import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WHITE BLUE BLOOD 3 TOURNAMENT",
  description: "เว็บไซต์สำหรับดูข้อมูลการแข่งขันภายในวิทยาลัยเทคโนโลยีภาคตะวันออก (อี.เทค.) โครงการแข่งขัน WHITE BLUE BLOOD 3 TOURNAMENT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
