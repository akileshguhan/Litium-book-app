import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast'; // For showing pop-up notifications

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LITIUM',
  description: 'Personal Book Review Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="bottom-right" />
          <Navbar />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}