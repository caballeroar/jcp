import Environment from "./Environment";
import Hero from "./Hero";
import MethodologyCasesGroup from "./MethodologyCasesGroup";
import Testimonials from "./Testimonials";
import Services from "./Services";
import Contact from "./Contact";

export default function ClientPage() {
  return (
    <>
      <main>
        <Hero />

        <div className="min-h-screen">
          <Environment />
        </div>

        <MethodologyCasesGroup />

        <Testimonials />

        <Services />

        <Contact />

        <Hero />
      </main>
    </>
  );
}
