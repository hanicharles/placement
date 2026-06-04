import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import {
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Phone,
  Award,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  HelpCircle,
  Building,
  Briefcase,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — REVA RACE" },
      {
        name: "description",
        content: "Get in touch with REVA Academy for Corporate Excellence (RACE).",
      },
    ],
  }),
  component: ContactUsPage,
});

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.720550680965!2d77.63243281418869!3d13.11688139076066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae19721a651fd3%3A0xdee225fe28f600f6!2sREVA%20University!5e0!3m2!1sen!2sin!4v1602078353293!5m2!1sen!2sin";

const GENERAL_PHONE_TEL = "8904058866";
const GENERAL_EMAIL = "race@reva.edu.in";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type FAQItem = {
  question: string;
  answer: string;
};

const FAQS: FAQItem[] = [
  {
    question: "What are the eligibility criteria for the M.Tech programs at RACE?",
    answer: "Candidates should possess a B.E/B.Tech or equivalent degree in engineering, or an MCA/M.Sc in computer science/mathematics, with a minimum aggregate of 50%. A minimum of 1-2 years of working experience in technology, software, or analytical roles is preferred, but motivated freshers with strong profiles are also considered.",
  },
  {
    question: "How does the blended learning format work for working professionals?",
    answer: "The program is designed to suit working schedules. It combines self-paced online modules, 24/7 virtual lab access for programming/experiments, and live interactive classes/hands-on labs held over weekends. This allows professionals to balance their studies with active corporate careers.",
  },
  {
    question: "Does RACE provide lateral placement assistance?",
    answer: "Yes. RACE has a dedicated career services cell that assists students with career counseling, resume building, interview preparation, and lateral transitions. We partner with over 100 top-tier organizations (including L&T, HAL, Infosys, Capgemini, and others) for direct hiring pipelines.",
  },
  {
    question: "Are the programs certified by REVA University?",
    answer: "Yes, all M.Tech and PG Diploma programs are officially awarded by REVA University, Bangalore. They are UGC recognized and aligned with the corporate techno-functional requirements of the current tech industry.",
  },
  {
    question: "How can corporate organizations partner with RACE?",
    answer: "Corporates can collaborate with us in multiple ways: custom corporate training programs, research consultancy contracts, guest lecture sponsorships, and direct hiring drives from our pre-screened talent cohorts. Please contact Paramesh G at paramesh.g@reva.edu.in for business engagements.",
  },
];

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-black/5 bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-200">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-neutral-800 hover:text-[#FF5900] transition-colors focus:outline-none"
      >
        <span className="flex items-center gap-2.5">
          <HelpCircle className="h-4.5 w-4.5 text-[#FF5900] shrink-0" />
          {item.question}
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-[#FF5900]" /> : <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 font-medium leading-relaxed border-t border-black/5 bg-neutral-50/50">
          {item.answer}
        </div>
      )}
    </div>
  );
}

interface ContactBusinessCardProps {
  layout: "photo-left" | "photo-right";
  name: string;
  role: string;
  phone: string;
  email: string;
  web?: string;
  address: string;
  photoUrl: string;
}

function ContactBusinessCard({
  layout,
  name,
  role,
  phone,
  email,
  web = "race.reva.edu.in",
  address,
  photoUrl,
}: ContactBusinessCardProps) {
  const isPhotoLeft = layout === "photo-left";

  return (
    <div className={`relative w-full max-w-[560px] bg-[#F8F9FA] border border-black/5 rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden px-6 py-8 sm:px-10 sm:py-10 flex ${
      isPhotoLeft ? "flex-col md:flex-row" : "flex-col-reverse md:flex-row"
    } gap-6 md:gap-8 items-center justify-start md:justify-between min-h-[250px] md:min-h-[300px]`}>
      
      {/* Background Zig-Zag Wave Decoration */}
      <svg
        className="absolute w-64 h-full text-[#FFDF9F]/15 pointer-events-none select-none z-0"
        style={{
          left: isPhotoLeft ? -30 : "auto",
          right: isPhotoLeft ? "auto" : -30,
          top: 0
        }}
        viewBox="0 0 100 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 10,20 L 90,55 L 10,90 L 90,125 L 10,160 L 90,195" />
      </svg>

      {/* Conditionally render photo first if photo-left, else render details first */}
      {isPhotoLeft ? (
        <>
          {/* Photo container (Left on Desktop, Top on Mobile) */}
          <div className="w-full md:w-[32%] shrink-0 flex items-center justify-center relative z-10">
            <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-[20px] overflow-hidden shadow-md border-4 border-white bg-white">
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details container (Right on Desktop, Bottom on Mobile) */}
          <div className="flex-1 text-left relative z-10 w-full flex flex-col justify-center">
            {/* Name */}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 leading-tight uppercase font-sans">
              {name}
            </h2>
            
            {/* Subtitle with gold accent line next to it */}
            <div className="flex items-center gap-2.5 mt-2 mb-5">
              <div className="h-[2.5px] w-6 bg-[#E59500] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#E59500] tracking-wider uppercase">
                {role}
              </span>
            </div>

            {/* Details List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-neutral-800 shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#E59500] transition-colors"
                >
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-neutral-800 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#E59500] transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4.5 w-4.5 text-neutral-800 shrink-0" />
                <a
                  href={`https://${web}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#E59500] transition-colors"
                >
                  {web}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-neutral-800 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">
                  {address}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Details container (Left on Desktop, Top on Mobile) */}
          <div className="flex-1 text-left relative z-10 w-full flex flex-col justify-center">
            {/* Name */}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 leading-tight uppercase font-sans">
              {name}
            </h2>
            
            {/* Subtitle with gold accent line next to it */}
            <div className="flex items-center gap-2.5 mt-2 mb-5">
              <div className="h-[2.5px] w-6 bg-[#E59500] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#E59500] tracking-wider uppercase">
                {role}
              </span>
            </div>

            {/* Details List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-neutral-800 shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#E59500] transition-colors"
                >
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-neutral-800 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#E59500] transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4.5 w-4.5 text-neutral-800 shrink-0" />
                <a
                  href={`https://${web}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#E59500] transition-colors"
                >
                  {web}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-neutral-800 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">
                  {address}
                </span>
              </div>
            </div>
          </div>

          {/* Photo container (Right on Desktop, Bottom on Mobile) */}
          <div className="w-full md:w-[32%] shrink-0 flex items-center justify-center relative z-10">
            <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-[20px] overflow-hidden shadow-md border-4 border-white bg-white">
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ContactUsPage() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const mailtoHref = useMemo(() => {
    const subject = form.subject.trim() || "RACE Contact Query";
    const body = [
      `First Name: ${form.firstName}`,
      `Last Name: ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      "",
      form.message,
    ].join("\n");

    return `mailto:${encodeURIComponent(GENERAL_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = "First Name is required";
    if (!form.lastName.trim()) e.lastName = "Last Name is required";

    const email = form.email.trim();
    if (!email) e.email = "Email Address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";

    const phone = form.phone.trim();
    if (!phone) e.phone = "Phone Number is required";
    else if (!/^[0-9+()\-\s]{7,}$/.test(phone)) e.phone = "Enter a valid phone number";

    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";

    return e;
  };

  const onSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length) return;

    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.location.href = mailtoHref;
    }
  };

  const setField = (k: keyof FormState, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Navigation Topbar */}
      <div className="border-b-[3px] border-[#FF5900] bg-[#FFFBDC] text-neutral-800 shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="mx-auto flex max-w-6xl flex-row items-center justify-between px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-95 transition-opacity">
            <img src="/image/reva_logi.png" alt="REVA University" className="h-14 sm:h-16 w-auto object-contain" />
          </Link>
          <SiteNav variant="light" />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Banner Hero Section */}
        <section className="relative rounded-3xl bg-white p-8 md:p-12 shadow-sm border border-black/5 overflow-hidden mb-12">
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,211,165,0.4),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,240,220,0.5),transparent_50%)]" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center max-w-6xl mx-auto relative z-10">
            <div className="md:col-span-7 text-left flex flex-col justify-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5900]/10 px-3 py-1 text-xs font-bold text-[#FF5900] border border-[#FF5900]/15">
                  🎓 Excellence in Corporate Training
                </span>
              </div>
              <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                Connect with the
                <br />
                <span className="bg-gradient-to-r from-[#FF5900] to-[#FF8237] bg-clip-text text-transparent">RACE</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600 font-medium max-w-xl">
                Empowering professionals through world-class training and development programs. Connect with our expert team for programs, research opportunities, and corporate training solutions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://race.reva.edu.in/programs/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3E62] px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#12223A] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
                >
                  Explore Programs <Building className="h-4 w-4" />
                </a>
                <a
                  href="#inquiry-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3.5 text-xs font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center"
                >
                  <Phone className="h-3.5 w-3.5 text-[#FF5900]" /> Get In Touch
                </a>
              </div>
            </div>

            {/* Right tilted card column */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="w-full max-w-[380px] aspect-square bg-[#1E3E62] border border-[#F9BF29]/40 rotate-[-2deg] rounded-2xl p-2.5 shadow-lg">
                <div className="w-full h-full bg-[#f2f2f2] rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner">
                  <img
                    src="https://race.reva.edu.in/wp-content/uploads/careerpage-infra.png"
                    alt="REVA University Campus Building"
                    className="w-full h-full object-cover rounded-xl scale-102"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Corporate Research & Trainers */}
        <section className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-2 justify-items-center">
          <ContactBusinessCard
            layout="photo-left"
            name="PARAMESH G"
            role="Assistant Professor & Placement Head"
            phone="+91 96556 28661"
            email="paramesh.g@reva.edu.in"
            web="race.reva.edu.in"
            address="RACE, REVA University, Bengaluru"
            photoUrl="/image/paramesh_g.png"
          />

          <ContactBusinessCard
            layout="photo-right"
            name="SHINU ABHI, PhD"
            role="Director, Corporate Training"
            phone="+91 99729 16030"
            email="shinuabhi@reva.edu.in"
            web="race.reva.edu.in"
            address="RACE, REVA University, Bengaluru"
            photoUrl="/image/shinu_abhi.png"
          />
        </section>

        {/* Interactive FAQ Accordion */}
        <section className="mt-16">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-neutral-500 font-medium mt-1">Get instant details about academic delivery, corporate schedules, and placement support</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((item, idx) => (
              <FAQAccordion
                key={idx}
                item={item}
                isOpen={openFaqIndex === idx}
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </section>

        {/* Drop us a line & Visit Campus split */}
        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          
          {/* Contact Inquiry Form */}
          <div id="inquiry-form" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">Drop us a line</h2>
            <p className="mt-1 text-xs text-neutral-500 font-semibold leading-relaxed">
              If you have any direct inquiries, submit this contact form and our team will get back to you.
            </p>

            {submitted ? (
              <div className="mt-8 p-6 border border-emerald-100 bg-emerald-50/50 rounded-2xl text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-black text-emerald-800">Form Submission Activated</h4>
                <p className="text-xs text-emerald-600 font-semibold max-w-md mx-auto leading-relaxed">
                  Your system's default email client has been triggered to send this query directly to our admissions office. Thank you!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#FF5900] hover:underline"
                >
                  Submit another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">First Name*</label>
                    <input
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition"
                    />
                    {errors.firstName && <p className="mt-1 text-[10px] font-bold text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Last Name*</label>
                    <input
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition"
                    />
                    {errors.lastName && <p className="mt-1 text-[10px] font-bold text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Email Address*</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition"
                  />
                  {errors.email && <p className="mt-1 text-[10px] font-bold text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Phone Number*</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition"
                  />
                  {errors.phone && <p className="mt-1 text-[10px] font-bold text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Subject*</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setField("subject", e.target.value)}
                    placeholder="Enter subject of your query"
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition"
                  />
                  {errors.subject && <p className="mt-1 text-[10px] font-bold text-red-600">{errors.subject}</p>}
                </div>

                <div>
                  <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Message*</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    placeholder="Type your message here..."
                    className="mt-2 w-full resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] transition"
                  />
                  {errors.message && <p className="mt-1 text-[10px] font-bold text-red-600">{errors.message}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-[#FF5900] px-5 py-2.5 text-xs font-black text-white uppercase tracking-wider shadow-sm hover:bg-[#e04f00] focus:outline-none focus:ring-2 focus:ring-[#FF5900]/40 transition cursor-pointer"
                  >
                    Submit Query
                  </button>
                  <a
                    href={mailtoHref}
                    className="text-[11px] font-bold text-neutral-500 hover:text-neutral-700 hover:underline"
                  >
                    Or open in mail application
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Visit Campus, Map and Career CTA */}
          <div className="space-y-6">
            {/* Campus Address box */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">Visit Our Campus</h2>
              <div className="mt-4 rounded-xl bg-[#FFFBDC]/60 p-5 border border-[#FF5900]/10">
                <p className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider">
                  📌 Campus Address
                </p>
                <p className="mt-3 text-xs leading-relaxed text-neutral-700 font-semibold">
                  REVA Academy for Corporate Excellence – RACE
                  <br />
                  REVA University
                  <br />
                  Rukmini Educational Charitable Trust
                  <br />
                  Kattigenahalli, Yelahanka
                  <br />
                  Bangalore, Karnataka, India 560 064
                </p>
                <hr className="my-4 border-black/5" />
                <p className="text-xs font-black text-neutral-800 uppercase tracking-wider flex items-center gap-1">
                  📞 Phone Hotline:{" "}
                  <a className="text-[#FF5900] hover:underline normal-case font-black" href={`tel:${GENERAL_PHONE_TEL}`}>
                    +91 89040 58866
                  </a>
                </p>
              </div>
            </div>

            {/* Google Map iframe */}
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="border-b border-black/5 bg-neutral-50 px-6 py-4">
                <h3 className="text-xs font-black text-neutral-850 uppercase tracking-wider">Location on map</h3>
              </div>
              <iframe
                title="REVA University Map"
                src={MAP_EMBED_URL}
                className="h-[260px] w-full border-none"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Social Media Strip */}
        <section className="mt-12 rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500">Like and Follow us on Social Media</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <a
              href="https://www.facebook.com/RACE-REVA-University-105159408557689"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-neutral-600 transition hover:border-[#3b5998] hover:text-[#3b5998] hover:bg-neutral-50"
              title="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/school/racereva/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-neutral-600 transition hover:border-[#0077b5] hover:text-[#0077b5] hover:bg-neutral-50"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/racereva/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-neutral-600 transition hover:border-[#e1306c] hover:text-[#e1306c] hover:bg-neutral-50"
              title="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/RACEREVA"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-neutral-600 transition hover:border-[#1da1f2] hover:text-[#1da1f2] hover:bg-neutral-50"
              title="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCiu0y2YYqtQ4qZomWM-6xtg"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-neutral-600 transition hover:border-[#ff0000] hover:text-[#ff0000] hover:bg-neutral-50"
              title="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white mt-12 py-6 text-center text-xs text-neutral-500 font-bold">
        © REVA University · RACE · race.reva.edu.in
      </footer>
    </div>
  );
}
