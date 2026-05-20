import { Header, Footer } from "@/components/index";
import CartSheet from "@/components/sheet/CartSheet";


export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <CartSheet />
    
      <Footer />
    </>
  );
}


