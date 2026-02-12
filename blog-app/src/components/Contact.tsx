// Contact Page: Contact form handling user inquiries
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
  } = useForm<ContactFormData>({
    mode: "onChange",
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact Form Data:", data);
    // Simulate generic "send" action
    reset();
  };

  return (
    <div className="layout-grid">
      {/* Contact Form Section */}
      <div className="widget">
        <h2 className="widget-title">Get in Touch</h2>

        {isSubmitSuccessful && (
          <div className="success-message">
            Thank you for reaching out! We will get back to you shortly.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="comment-form contact-form-reset"
        >
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Your Name"
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="text-danger">*</span>
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
              className={`form-input ${errors.email ? "error" : ""}`}
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
              Message <span className="text-danger">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              {...register("message", {
                required: "Message is required",
                validate: (value) =>
                  value.trim().split(/\s+/).length >= 10 ||
                  "Message must be at least 10 words long",
              })}
              className={`form-input resize-vertical ${errors.message ? "error" : ""}`}
              placeholder="Write your message here..."
            />
            {errors.message && (
              <p className="form-error">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary contact-button-wrapper"
          >
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>

      {/* Contact Info Sidebar */}
      <aside className="sidebar">
        <div className="widget">
          <h3 className="widget-title">Contact Information</h3>
          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-icon-box primary">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="contact-item-title">Email Us</h4>
                <p className="contact-item-text">hello@devpulse.com</p>
                <p className="contact-item-text">support@devpulse.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon-box secondary">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="contact-item-title">Visit Us</h4>
                <p className="contact-item-text">38 Florens Ave</p>
                <p className="contact-item-text">Toronto, ON M1L 1R6</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon-box accent">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="contact-item-title">Call Us</h4>
                <p className="contact-item-text">+1 (437) 383-1996</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
