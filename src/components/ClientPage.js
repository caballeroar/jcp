import Hero from "./Hero";
import Environment from "./Environment";
import Methodology2 from "./Methodology_2";
import Cases from "./Cases";
import Testimonials from "./Testimonials";
import Services from "./Services";
import Contact from "./Contact";

export default function ClientPage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="min-h-screen">
        <Environment />
      </div>
      <Methodology2 />
      <Cases />
      <Testimonials />
      <Services />
      <Contact />
    </main>
  );
}
