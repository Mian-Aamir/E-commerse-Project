import { useState } from "react";
import {
  Users,
  Wallet,
  ShieldCheck,
  TrendingUp,
  Package,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  BookOpen,
  Star,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { value: "2M+", label: "Active Buyers" },
  { value: "150K+", label: "Sellers Onboard" },
  { value: "40+", label: "Cities Covered" },
  { value: "4.7/5", label: "Average Seller Rating" },
];

const benefits = [
  {
    icon: Users,
    title: "Reach More Customers",
    text: "Get your products in front of thousands of active shoppers every day.",
  },
  {
    icon: Wallet,
    title: "Fast Payouts",
    text: "Receive your earnings quickly and track every sale from your dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    text: "Your account and transactions are protected with industry-standard security.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    text: "Access simple tools and insights that help your store grow over time.",
  },
];

const categories = [
  { icon: Smartphone, name: "Electronics" },
  { icon: Shirt, name: "Clothing" },
  { icon: HomeIcon, name: "Home & Living" },
  { icon: Sparkles, name: "Beauty" },
  { icon: Dumbbell, name: "Sports" },
  { icon: BookOpen, name: "Books" },
  { icon: Package, name: "More Categories" },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    text: "Sign up as a seller and tell us a bit about your business.",
  },
  {
    number: "02",
    title: "List Your Products",
    text: "Add products with photos, pricing and categories in minutes.",
  },
  {
    number: "03",
    title: "Start Selling",
    text: "Once approved, your products go live and orders start coming in.",
  },
];

const plans = [
  {
    name: "Individual",
    price: "PKR 0",
    period: "/ month",
    description: "For new sellers just getting started, no upfront cost.",
    features: [
      "List up to 40 products",
      "Standard payout in 7 days",
      "Basic seller dashboard",
      "Email support",
    ],
    highlighted: false,
    buttonText: "Start Free",
  },
  {
    name: "Professional",
    price: "PKR 2,500",
    period: "/ month",
    description: "For growing businesses that want more tools and reach.",
    features: [
      "Unlimited product listings",
      "Fast payout in 2 days",
      "Advanced analytics dashboard",
      "Priority support",
      "Featured placement in search",
    ],
    highlighted: true,
    buttonText: "Go Professional",
  },
];

const testimonials = [
  {
    name: "Ayesha K.",
    role: "Clothing Seller",
    text: "My orders doubled within the first two months. The dashboard makes it so easy to track everything.",
    rating: 5,
  },
  {
    name: "Bilal R.",
    role: "Electronics Seller",
    text: "Payouts are always on time and support actually responds fast when I need help.",
    rating: 5,
  },
  {
    name: "Sana M.",
    role: "Home Decor Seller",
    text: "Listing products took minutes. I was live and getting orders the same week.",
    rating: 4,
  },
];

const faqs = [
  {
    question: "How much does it cost to start selling?",
    answer:
      "You can start for free with our Individual plan. Upgrade to Professional anytime as your business grows.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Most seller accounts are reviewed and approved within 24 to 48 hours after submitting your details.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Individual sellers are paid every 7 days, and Professional sellers get faster payouts every 2 days.",
  },
  {
    question: "Can I sell in more than one category?",
    answer:
      "Yes, you can list products across as many categories as are relevant to your business.",
  },
];

const SellerPage = () => {
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <div>
      {/* Hero banner, using the same background style as the homepage Hero */}
      <div className="w-full bg-blue-600 relative overflow-hidden">
        {/* Decorative circle blobs, matching the homepage Hero */}
        <div className="absolute -left-16 -top-24 w-72 h-72 bg-blue-500/40 rounded-full" />
        <div className="absolute right-10 -bottom-20 w-80 h-80 bg-blue-500/40 rounded-full" />
        <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/30 rounded-full" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative py-16 md:py-24 text-center">
          <p className="text-sm text-blue-200 mb-3">Become a Seller</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Start Selling on Brand Name
          </h1>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            Join thousands of sellers reaching customers every day. Create
            your store, list your products, and start growing your business
            with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-white hover:bg-slate-100 text-blue-700 px-8 py-3 rounded-md font-medium">
              Sign Up as Seller
            </button>
            <button className="border border-white/60 hover:bg-white/10 text-white px-8 py-3 rounded-md font-medium">
              Learn More
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-blue-200 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Why Sell With Us
        </h2>
        <p className="text-slate-500 text-center mb-10 max-w-lg mx-auto">
          Everything you need to launch, manage and grow your store in one
          place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-blue-600" size={22} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-500">{benefit.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular categories to sell in */}
      <div className="bg-slate-50 py-14">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Popular Categories to Sell In
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className="bg-white rounded-xl border border-slate-100 p-5 text-center cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-blue-600" size={18} />
                  </div>
                  <p className="text-xs font-medium text-slate-700">
                    {category.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How it works steps */}
      <div className="bg-white py-14">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-14">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting line between steps, desktop only */}
            <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-blue-100" />

            {steps.map((step) => (
              <div key={step.number} className="text-center relative">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 relative z-10">
                  {step.number}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing plans */}
      <div className="bg-slate-50 py-14">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Choose Your Selling Plan
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-lg mx-auto">
            Start free, upgrade whenever your business is ready to grow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 relative ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white border border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3
                  className={`font-semibold text-lg mb-1 ${
                    plan.highlighted ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-5 ${
                    plan.highlighted ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span
                    className={
                      plan.highlighted ? "text-blue-200" : "text-slate-500"
                    }
                  >
                    {" "}
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={16}
                        className={`mt-0.5 shrink-0 ${
                          plan.highlighted ? "text-white" : "text-blue-600"
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-blue-50" : "text-slate-600"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-md font-medium ${
                    plan.highlighted
                      ? "bg-white text-blue-700 hover:bg-slate-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller testimonials */}
      <div className="bg-white py-14">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            What Our Sellers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-slate-50 rounded-xl p-6 border border-slate-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < testimonial.rating
                          ? "fill-blue-500 text-blue-500"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mb-5">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-slate-900 text-sm">
                  {testimonial.name}
                </p>
                <p className="text-xs text-slate-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="bg-slate-50 py-14">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-slate-900 text-sm">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-sm text-slate-500">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final call to action, Amazon-style split card */}
      <div className="bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="bg-slate-50 rounded-3xl overflow-hidden grid md:grid-cols-2 items-stretch">
            {/* Left side: headline, description, sign up button */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                Start selling
                <br />
                with Brand Name
              </h2>
              <p className="text-slate-600 mb-8 max-w-md">
                Connect with more customers using our high-impact tools and
                programs.
              </p>
              <div className="flex items-center gap-5 flex-wrap">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full">
                  Sign Up*
                </button>
                <p className="text-sm text-slate-600 leading-snug">
                  Get <span className="font-semibold">10% back</span> on your
                  first
                  <br />
                  PKR 500,000 in sales
                </p>
              </div>
            </div>

            {/* Right side: image */}
            <div className="relative min-h-[280px] md:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1200&q=80"
                alt="Seller packing customer orders"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            *A Professional selling account is PKR 2,500 a month plus selling
            fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;