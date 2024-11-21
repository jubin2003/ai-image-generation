import Image from "next/image";
import Navbar from "./dashboard/_components/Navbar";
import Features from "./dashboard/_components/Features";
import Pricing from "./dashboard/_components/Pricing";
import Stats from "./dashboard/_components/Stats";
import Footer from "./dashboard/_components/Footer";

export default function Home() {
  return (
    <div>

      <Navbar />
      <Features />
      <Stats />
      <Pricing />
      <Footer />
    </div>
  );
}
