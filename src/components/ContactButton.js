"use client";

import { Button } from "./ui";
import { ArrowRight } from "phosphor-react";

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
      variant="outline"
      icon={<ArrowRight />}
      //   iconBg="primary"
      iconPosition="right"
      onClick={handleContact}
    >
      {children}
    </Button>
  );
}
