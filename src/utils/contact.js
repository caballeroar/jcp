export async function submitContactForm(formData) {
  try {
    const payload = {
      name: formData.name?.trim() || "",
      email: formData.email?.trim() || "",
      organization: formData.organization?.trim() || "",
      message: formData.message?.trim() || "",
      companyWebsite: formData.companyWebsite?.trim() || "",
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.success) {
      throw new Error(data?.error || "Request failed");
    }

    return {
      ok: true,
      message: "Thank you. We will respond within a few working days.",
    };
  } catch {
    return {
      ok: false,
      message:
        "We could not submit your request right now. Please try again later.",
    };
  }
}
