import { DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const ibmPlexSans = DM_Sans({
  subsets: ["latin"],
  weight: ['200','300','400','500','600','700']
});

export const metadata = {
  title: 'SalesFlow',
  description: "Automated lead generation, lead scoring, email automation, pipeline management, sales forecasting, CRM integration, and AI-powered tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}