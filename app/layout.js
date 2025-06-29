import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Buck-It | Smart Personal Finance Dashboard",
  description: "Take control of your finances with Buck-It - the smart way to budget, track expenses, and save money",
  keywords: "personal finance, budgeting, expense tracking, savings, money management, Buck-It",
  authors: [{ name: "Buck-It Team" }],
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  openGraph: {
    title: "Buck-It | Smart Personal Finance Dashboard",
    description: "Take control of your finances with Buck-It - the smart way to budget, track expenses, and save money",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.png" type="image/png" />
          <link rel="apple-touch-icon" href="/favicon.png" />
          <meta name="theme-color" content="#34A853" />
        </head>
        <body className={`${inter.className}`} suppressHydrationWarning={true}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          <footer className="bg-gradient-to-r from-green-50 to-green-100 py-12 border-t border-green-200">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-600 font-medium">
                Made by Anshul with ❤️ for smarter financial decisions
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
