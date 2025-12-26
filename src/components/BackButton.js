"use client";

import { ArrowLeft } from "phosphor-react";
import { Button } from "./ui";

export default function BackButton({ href = "/", label = "Back" }) {
  return (
    <Button
      theme="brand"
      iconPosition="left"
      icon={<ArrowLeft size={20} weight="bold" />}
      href={href}
    >
      {label}
    </Button>
  );
}
