import Environment from "./Environment";
import Hero from "./Hero";
import MethodologyCasesGroup from "./MethodologyCasesGroup";
import Testimonials from "./Testimonials";
import Services from "./Services";
import Contact from "./Contact";

export default function ClientPage({ initialLocale = "en" }) {
  return (
    <>
      <main>
        <Hero />

        <div className="min-h-screen">
          <Environment locale={initialLocale} />
        </div>

        <MethodologyCasesGroup />

        <Testimonials />

        <Services />

        <Contact />
      </main>
    </>
  );
}
