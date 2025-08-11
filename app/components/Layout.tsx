// components/layout/Layout.tsx
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type LayoutProps = {
    children: ReactNode;
};
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-1 p-4">
                {children}
            </main>
            <Footer/>
        </div>
    );
}
