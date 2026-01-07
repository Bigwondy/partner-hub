import { Search, Book, MessageCircle, FileText, ExternalLink, Phone, Mail } from "lucide-react";
import { useState } from "react";

const helpTopics = [
  {
    id: 1,
    title: "Getting Started",
    description: "Learn the basics of using the Partner Portal",
    icon: Book,
    articles: 12,
  },
  {
    id: 2,
    title: "Card Management",
    description: "How to manage cards, limits, and status changes",
    icon: FileText,
    articles: 8,
  },
  {
    id: 3,
    title: "Disputes & Chargebacks",
    description: "Understanding the dispute process",
    icon: MessageCircle,
    articles: 15,
  },
  {
    id: 4,
    title: "Reports & Analytics",
    description: "Generating and understanding reports",
    icon: FileText,
    articles: 6,
  },
];

const faqItems = [
  {
    question: "How do I submit a bulk card request?",
    answer: "Navigate to Card Requests, click 'New Request', then select 'Bulk Upload' option to upload a CSV file with multiple card requests.",
  },
  {
    question: "What is the dispute resolution timeline?",
    answer: "Most disputes are resolved within 14-45 days depending on the dispute type and scheme rules (Visa/Mastercard).",
  },
  {
    question: "How can I change a user's role?",
    answer: "Go to User Management, find the user, click the actions menu, and select 'Change Role'. Only Admins can modify user roles.",
  },
  {
    question: "When are settlements processed?",
    answer: "Settlements are typically processed daily by 3:00 PM WAT. You'll receive a notification when your settlement is complete.",
  },
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">How can we help you?</h1>
        <p className="text-muted-foreground mt-2">
          Search our knowledge base or browse topics below
        </p>
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 h-14 text-lg"
          />
        </div>
      </div>

      {/* Help Topics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Browse Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpTopics.map((topic) => (
            <div
              key={topic.id}
              className="card-elevated p-6 hover:border-accent/50 cursor-pointer transition-all group"
            >
              <div className="p-3 bg-accent/10 rounded-xl w-fit mb-4">
                <topic.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
              <p className="text-xs text-accent mt-3">{topic.articles} articles</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="card-elevated divide-y divide-border">
          {faqItems.map((faq, index) => (
            <div key={index} className="p-4">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full text-left flex items-center justify-between gap-4"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <span className="text-muted-foreground text-xl">
                  {expandedFaq === index ? "−" : "+"}
                </span>
              </button>
              {expandedFaq === index && (
                <p className="mt-3 text-muted-foreground text-sm animate-fade-in">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email Support</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get help via email within 24 hours
              </p>
              <a
                href="mailto:support@pavilion.com"
                className="inline-flex items-center gap-1 text-sm text-accent mt-3 hover:underline"
              >
                support@pavilion.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-success/10 rounded-xl">
              <Phone className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Phone Support</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Available Mon-Fri, 9AM-5PM WAT
              </p>
              <a
                href="tel:+2341234567890"
                className="inline-flex items-center gap-1 text-sm text-accent mt-3 hover:underline"
              >
                +234 123 456 7890
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
