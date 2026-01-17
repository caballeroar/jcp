import Environment from "./Environment";
import Hero from "./Hero";
import MethodologyCasesGroup from "./MethodologyCasesGroup";
import Testimonials from "./Testimonials";
import Services from "./Services";
import Contact from "./Contact";
import Cases from "./Cases";
import Methodology2 from "./Methodology_2";

export default function ClientPage() {
  return (
    <>
      <main>
        <Hero />

        <div className="min-h-screen">
          <Environment />
        </div>
        <Methodology2 />
        <Cases />

        {/* <MethodologyCasesGroup /> */}

        <Testimonials />

        <Services />

        <Contact />
      </main>
    </>
  );
}
