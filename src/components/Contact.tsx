import { Send, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Contact Page Component with form and info details. */
export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact Form Data:", data);
    // Simulate generic "send" action
    alert(`Message sent! Thanks, ${data.name}.`);
    reset();
  };

  return (
    <div className="layout-grid">
      {/* Contact Form Section */}
      <div className="widget">
        <h2 className="widget-title">Get in Touch</h2>

        {isSubmitSuccessful && (
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              padding: "1rem",
              borderRadius: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            Thank you for reaching out! We will get back to you shortly.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="comment-form"
          style={{
            marginTop: 0,
            boxShadow: "none",
            border: "none",
            padding: 0,
            backgroundColor: "transparent",
          }}
        >
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              className="form-input"
              placeholder="Your Name"
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="form-input"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              id="subject"
              {...register("subject")}
              className="form-input"
              placeholder="What is this regarding?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              {...register("message", { required: "Message is required" })}
              className="form-input"
              style={{ resize: "vertical" }}
              placeholder="Write your message here..."
            />
            {errors.message && (
              <p className="form-error">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem", gap: "0.5rem" }}
          >
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>

      {/* Contact Info Sidebar */}
      <aside className="sidebar">
        <div className="widget">
          <h3 className="widget-title">Contact Information</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <div
                style={{
                  backgroundColor: "rgba(244, 114, 182, 0.1)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  color: "var(--primary)",
                }}
              >
                <Mail size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  Email Us
                </h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  hello@devpulse.com
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  support@devpulse.com
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <div
                style={{
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  color: "var(--secondary)",
                }}
              >
                <MapPin size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  Visit Us
                </h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  123 Tech Street
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  San Francisco, CA 94107
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <div
                style={{
                  backgroundColor: "rgba(6, 182, 212, 0.1)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  color: "var(--accent)",
                }}
              >
                <Phone size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  Call Us
                </h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
