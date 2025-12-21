"use client";

import { Button } from "./ui";
import { ArrowLeft } from "phosphor-react";

export default function ContactButton({ children }) {
  const handleContact = () => {
    window.open(
      "https://www.linkedin.com/in/jnavarrooviedo/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Button
      icon={<ArrowLeft />}
      theme="light"
      iconPosition="left"
      onClick={handleContact}
    >
      {children}
    </Button>
  );
}
