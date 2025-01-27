import Navbar from "@/components/Navbar";
import AuthProvider from "./Provider";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import Footer from "@/components/footer/footer";

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: "WashCo.",
  description: "การให้บริการคืองานของเรา",
  keywords: "บริการซักผ้า",
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <Navbar />
          <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 p-4 overflow-auto">{children}</div>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}