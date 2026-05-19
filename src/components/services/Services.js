"use client";

import ServicesShowcase from "./ServicesShowcase";

export default function Services({ services = [], copy = {} }) {
  return <ServicesShowcase services={services} copy={copy} />;
}
