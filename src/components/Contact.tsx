// Contact Page: Contact form handling user inquiries
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Contact Page Component with form and info details.
export function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSending(true);
    setSubmitError("");
    setShowSuccess(false);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`, data);
      reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setSubmitError("Failed to send message. Please try again later.");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="layout-grid">
      {/* Contact Form Section */}
      <div className="widget">
        <h2 className="widget-title">Get in Touch</h2>

        {showSuccess && !submitError && (
          <div className="success-message">
            Thank you for reaching out! We will get back to you shortly.
          </div>
        )}
        {submitError && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {submitError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="comment-form contact-form-reset"
        >
          <div className="form-group floating-group" style={{ margin: 0, marginBottom: '1.5rem' }}>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              className={`form-input floating-input-global ${errors.name ? "error" : ""}`}
              placeholder=" "
            />
            <label htmlFor="name" className="floating-label-global">
              Name <span className="text-danger">*</span>
            </label>
            {errors.name && <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.name.message}</p>}
          </div>

          <div className="form-group floating-group" style={{ margin: 0, marginBottom: '1.5rem' }}>
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
              className={`form-input floating-input-global ${errors.email ? "error" : ""}`}
              placeholder=" "
            />
            <label htmlFor="email" className="floating-label-global">
              Email <span className="text-danger">*</span>
            </label>
            {errors.email && (
              <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.email.message}</p>
            )}
          </div>

          <div className="form-group floating-group" style={{ margin: 0, marginBottom: '1.5rem' }}>
            <input
              id="subject"
              {...register("subject")}
              className="form-input floating-input-global"
              placeholder=" "
            />
            <label htmlFor="subject" className="floating-label-global">
              Subject
            </label>
          </div>

          <div className="form-group floating-group" style={{ margin: 0, marginBottom: '1.5rem' }}>
            <textarea
              id="message"
              rows={5}
              {...register("message", {
                required: "Message is required",
                validate: (value) =>
                  value.trim().split(/\s+/).length >= 10 ||
                  "Message must be at least 10 words long",
              })}
              className={`form-input resize-vertical floating-input-global ${errors.message ? "error" : ""}`}
              placeholder=" "
            />
            <label htmlFor="message" className="floating-label-global">
              Message <span className="text-danger">*</span>
            </label>
            {errors.message && (
              <p className="form-error" style={{ marginTop: '0.25rem' }}>{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary contact-button-wrapper"
            disabled={isSending}
          >
            <Send size={18} /> {isSending ? "Sending..." : "Send Message"}
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
                <p className="contact-item-text">balathabo96@gmail.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon-box secondary">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="contact-item-title">Visit Us</h4>
                <p className="contact-item-text">Scarborough, ON</p>
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
