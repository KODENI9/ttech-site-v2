import Evenements from "./components/Evenements";
import Hero from "./components/Hero";
import HistorySection from "./components/HistorySection";
import MembresSection from "./components/MembresSection";
import ProjetsEnCours from "./components/ProjetsEnCours";

export default function Home() {
  return (
    <main className="p-4">
      <Hero />
      <ProjetsEnCours />
      <MembresSection />
      <HistorySection />
      <Evenements/>
    </main> 
  );
}
