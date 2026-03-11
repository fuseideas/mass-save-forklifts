"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import DatePickerInput from "./components/DatePickerInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, DownloadIcon } from "lucide-react";
import MegaMenu from "./components/MegaMenu";

type Sponsor = "cape-light" | "eversource" | "national-grid" | "unitil" | "";

interface ForkiftRow {
  purchaseDate: string;
  qty: number;
  purchasePrice: string;
  manufacturer: string;
  modelNumber: string;
}

interface ChargerRow {
  purchaseDate: string;
  qty: number;
  purchasePrice: string;
  manufacturer: string;
  modelNumber: string;
}

const FORKLIFT_REBATE = 6000;
const CHARGER_REBATE = 550;

const sponsorInfo: Record<
  string,
  { name: string; phone: string; email: string }
> = {
  "cape-light": {
    name: "Cape Light Compact",
    phone: "1-800-797-6699",
    email: "efficiency@capelightcompact.org",
  },
  eversource: {
    name: "Eversource",
    phone: "1-844-887-1400",
    email: "efficiencyma@eversource.com",
  },
  "national-grid": {
    name: "National Grid",
    phone: "1-800-787-1706",
    email: "efficiency@nationalgrid.com",
  },
  unitil: {
    name: "Unitil",
    phone: "1-888-301-7700",
    email: "efficiency@unitil.com",
  },
};

const emptyForklift = (): ForkiftRow => ({
  purchaseDate: "",
  qty: 0,
  purchasePrice: "",
  manufacturer: "",
  modelNumber: "",
});

const emptyCharger = (): ChargerRow => ({
  purchaseDate: "",
  qty: 0,
  purchasePrice: "",
  manufacturer: "",
  modelNumber: "",
});

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallTip, setShowInstallTip] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") {
        setInstallPrompt(null);
      }
    } else {
      setShowInstallTip(true);
    }
  };

  const [sponsor, setSponsor] = useState<Sponsor>("");
  const [accountNumber, setAccountNumber] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [installationSiteName, setInstallationSiteName] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [accountCity, setAccountCity] = useState("");
  const [accountState, setAccountState] = useState("MA");
  const [accountZip, setAccountZip] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [mailingCity, setMailingCity] = useState("");
  const [mailingState, setMailingState] = useState("");
  const [mailingZip, setMailingZip] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [payeeName, setPayeeName] = useState("");
  const [payeePhone, setPayeePhone] = useState("");
  const [payeeEmail, setPayeeEmail] = useState("");

  const [forklifts, setForklifts] = useState<ForkiftRow[]>([emptyForklift()]);
  const [chargers, setChargers] = useState<ChargerRow[]>([emptyCharger()]);

  const [certName, setCertName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateForklift = (
    index: number,
    field: keyof ForkiftRow,
    value: string | number
  ) => {
    setForklifts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateCharger = (
    index: number,
    field: keyof ChargerRow,
    value: string | number
  ) => {
    setChargers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addForklift = () => {
    if (forklifts.length < 3) {
      setForklifts((prev) => [...prev, emptyForklift()]);
    }
  };

  const removeForklift = (index: number) => {
    if (forklifts.length > 1) {
      setForklifts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addCharger = () => {
    setChargers((prev) => [...prev, emptyCharger()]);
  };

  const removeCharger = (index: number) => {
    if (chargers.length > 1) {
      setChargers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const forkliftTotal = forklifts.reduce(
    (sum, f) => sum + f.qty * FORKLIFT_REBATE,
    0
  );
  const chargerTotal = chargers.reduce(
    (sum, c) => sum + c.qty * CHARGER_REBATE,
    0
  );
  const totalRebate = forkliftTotal + chargerTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };

  const currentYear = new Date().getFullYear();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], ["-23%", "0%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.3]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const logos = [
    { src: "/lockup/berkshire.jpg", alt: "Berkshire Gas" },
    { src: "/lockup/compact.jpg", alt: "Cape Light Compact" },
    { src: "/lockup/eversource.jpg", alt: "Eversource" },
    { src: "/lockup/liberty.jpg", alt: "Liberty Utilities" },
    { src: "/lockup/ngrid.jpg", alt: "National Grid" },
    { src: "/lockup/unitil.jpg", alt: "Unitil" },
  ];

  if (submitted) {
    const info = sponsor ? sponsorInfo[sponsor] : null;
    const payload = {
      sponsor: sponsor || null,
      accountNumber,
      company: {
        name: companyName,
        installationSite: installationSiteName,
        applicationDate,
      },
      accountAddress: {
        address: accountAddress,
        city: accountCity,
        state: accountState,
        zip: accountZip,
      },
      mailingAddress: mailingAddress ? {
        address: mailingAddress,
        city: mailingCity,
        state: mailingState,
        zip: mailingZip,
      } : null,
      contact: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      },
      payee: {
        name: payeeName,
        phone: payeePhone,
        email: payeeEmail,
      },
      forklifts: forklifts.filter(f => f.qty > 0),
      chargers: chargers.filter(c => c.qty > 0),
      totals: {
        forkliftRebate: forkliftTotal,
        chargerRebate: chargerTotal,
        totalRebate,
      },
      certification: {
        name: certName,
        agreedToTerms: agreed,
        submittedAt: new Date().toISOString(),
      },
    };

    const steps = [
      {
        num: 1,
        title: "Generate PDF",
        desc: "Application data is rendered into a branded PDF document using a server-side template.",
        status: "complete" as const,
      },
      {
        num: 2,
        title: "Create DocuSign Envelope",
        desc: "PDF is sent to DocuSign via the eSignature REST API with signature and date tab positions.",
        status: "complete" as const,
      },
      {
        num: 3,
        title: "Embedded Signing Ceremony",
        desc: "A signing URL is generated and the user completes the signature in an embedded iframe — never leaving the app.",
        status: "current" as const,
      },
      {
        num: 4,
        title: "Webhook Confirmation",
        desc: "DocuSign sends a webhook callback when signing is complete. The signed PDF is stored and forwarded to the sponsor.",
        status: "pending" as const,
      },
    ];

    return (
      <div className="min-h-screen bg-[#f5f5f5] py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success header */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-mass-save-green-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-mass-save-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl mb-2">Application Submitted</h2>
            <p className="text-gray-600 mb-1">
              Estimated total rebate:{" "}
              <span className="font-bold text-mass-save-green text-xl">
                ${totalRebate.toLocaleString()}
              </span>
            </p>
            {info && (
              <p className="text-sm text-gray-500">
                Sponsor: {info.name} &middot; {info.phone}
              </p>
            )}
          </div>

          {/* DocuSign integration flow */}
          <div className="card">
            <h2 className="mb-1">Next: DocuSign Integration</h2>
            <p className="text-sm text-gray-500 mb-6">
              In production, the following steps execute automatically after submission.
            </p>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4 items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.status === "complete"
                      ? "bg-mass-save-green text-white"
                      : step.status === "current"
                      ? "bg-mass-save-green/15 text-mass-save-green ring-2 ring-mass-save-green"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.status === "complete" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.num}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                    <p className={`font-semibold text-sm ${
                      step.status === "pending" ? "text-gray-400" : "text-foreground"
                    }`}>{step.title}</p>
                    <p className={`text-xs mt-0.5 ${
                      step.status === "pending" ? "text-gray-300" : "text-gray-500"
                    }`}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JSON payload */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="mb-0">Application Payload</h2>
                <p className="text-sm text-gray-500 mt-1">
                  This data can be sent to any API — DocuSign, a database, email service, PDF generator, etc.
                </p>
              </div>
              <span className="text-xs font-mono bg-mass-save-green/10 text-mass-save-green px-2 py-1 rounded">
                JSON
              </span>
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
              <code>{JSON.stringify(payload, null, 2)}</code>
            </pre>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="px-6"
            >
              Edit Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky green top bar */}
      <motion.div
        className="bg-mass-save-green text-white sticky top-0 z-50"
        animate={{
          paddingTop: scrolled ? 8 : 16,
          paddingBottom: scrolled ? 8 : 16,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <motion.img
            src="/mass-save.png"
            alt="Mass Save"
            className="md:h-28"
            animate={{ height: scrolled ? 44 : 64 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <div className="flex items-center gap-4">
            <MegaMenu scrolled={scrolled} />
            {!isStandalone && (
              <button
                onClick={handleInstall}
                className="hidden md:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors font-medium text-sm px-3 py-1.5 rounded-md hover:bg-white/10"
              >
                <DownloadIcon className="w-4 h-4" />
                Install App
              </button>
            )}
            <motion.span
              className="font-bold tracking-wide"
              animate={{ fontSize: scrolled ? "1.25rem" : "2.25rem" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {currentYear}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Install tip modal for Safari/Firefox */}
      {showInstallTip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowInstallTip(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-sm mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-mass-save-headline mb-3">Install Mass Save App</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Safari (iPhone/iPad)</p>
                <p>Tap the <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Share</span> button, then select <strong>&quot;Add to Home Screen&quot;</strong></p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Safari (Mac)</p>
                <p>Click <strong>File → Add to Dock</strong> in the menu bar</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Chrome / Edge</p>
                <p>Click the install icon in the address bar, or go to <strong>Menu → Install App</strong></p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallTip(false)}
              className="mt-5 w-full bg-mass-save-green text-white font-semibold py-2.5 rounded-lg hover:bg-mass-save-green-dark transition-colors"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero header with parallax */}
      <div ref={heroRef} className="relative w-full h-80 md:h-[28rem] overflow-hidden">
        <motion.img
          src="/header.jpg"
          alt="Forklift in warehouse"
          className="absolute inset-0 w-full h-[130%] object-cover object-bottom"
          style={{ y: heroImageY, scale: heroScale }}
        />
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 flex items-center justify-start">
          <motion.div
            className="bg-white/50 backdrop-blur-xl ml-4 md:ml-12 p-6 md:p-10 max-w-lg border border-white/40 border-b-8 border-b-mass-save-green shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <motion.p
              className="text-sm font-bold tracking-wide text-mass-save-green mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Mass Save&reg; {currentYear}
            </motion.p>
            <motion.h1
              className="text-xl md:text-4xl font-black leading-tight text-mass-save-green"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Commercial Battery-Powered Forklift and Forklift Battery Chargers
              Rebate Application
            </motion.h1>
          </motion.div>
        </div>
      </div>

      {/* Sponsor logo lockup - sticky below nav */}
      <motion.div
        className="bg-[#f8f8f8] border-t border-b border-gray-200 sticky z-40 overflow-hidden"
        style={{ top: scrolled ? 60 : 96 }}
        animate={{
          paddingTop: scrolled ? 12 : 24,
          paddingBottom: scrolled ? 12 : 24,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-6 items-center justify-items-center gap-6 md:gap-10">
          {logos.map((logo) => (
            <motion.img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="w-auto object-contain"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ height: scrolled ? 56 : 112 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate className="max-w-4xl mx-auto space-y-6 px-4 py-8">
        {/* Instructions + Contact */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="card md:col-span-2">
            <h2 className="mb-3">Instructions</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-600">
              <li>
                Purchase qualifying equipment between{" "}
                <strong>January 1, {currentYear}</strong> and{" "}
                <strong>December 31, {currentYear}</strong>.
              </li>
              <li>
                Complete and submit this online application no later than{" "}
                <strong>January 31, {currentYear + 1}</strong>. Please have
                the following ready to upload:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>
                    A copy of the first page of your most recent electric
                    bill.
                  </li>
                  <li>
                    A copy of the receipt showing the qualifying model,
                    manufacturer, purchase date, and purchase price.
                  </li>
                  <li>
                    A signed W-9 for payee (wet ink or DocuSign e-signature).
                  </li>
                </ul>
              </li>
              <li>
                Your application will be reviewed and you will receive
                confirmation via email.
              </li>
            </ol>
          </div>
          <div className="card flex flex-col gap-4">
            <h2 className="text-base">Need Help?</h2>
            {[
              {
                name: "National Grid",
                phone: "1-800-787-1706",
                email: "efficiency@nationalgrid.com",
              },
              {
                name: "Unitil",
                phone: "1-888-301-7700",
                email: "efficiency@unitil.com",
              },
            ].map((sp) => (
              <div
                key={sp.name}
                className="rounded-lg p-3 bg-gray-50 border border-gray-100"
              >
                <p className="font-bold text-mass-save-headline text-sm">
                  {sp.name}
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  <a
                    href={`tel:${sp.phone}`}
                    className="text-xs text-gray-500 hover:text-mass-save-green flex items-center gap-1.5 no-underline"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {sp.phone}
                  </a>
                  <a
                    href={`mailto:${sp.email}`}
                    className="text-xs text-gray-500 hover:text-mass-save-green flex items-center gap-1.5 no-underline"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {sp.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sponsor Selection */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="mb-4">Electric Sponsor</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select your electric sponsor and provide your account number.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {(
              [
                ["cape-light", "Cape Light Compact"],
                ["eversource", "Eversource"],
                ["national-grid", "National Grid"],
                ["unitil", "Unitil"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  sponsor === value
                    ? "border-mass-save-green bg-mass-save-green-light ring-2 ring-mass-save-green/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <input
                  type="radio"
                  name="sponsor"
                  value={value}
                  checked={sponsor === value}
                  onChange={(e) => setSponsor(e.target.value as Sponsor)}
                  required
                  className="accent-[var(--mass-save-green)]"
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
          <div className="max-w-md">
            <Label htmlFor="accountNumber">Electric Account Number *</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              placeholder="Enter your electric account number"
              className="mt-1.5"
            />
          </div>
        </motion.div>

        {/* Account Holder Information */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="mb-6">Account Holder Information</h2>

          {/* Company Details */}
          <div className="p-4 mb-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="mt-1.5 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="installationSiteName">Installation Site Name *</Label>
                <Input
                  id="installationSiteName"
                  value={installationSiteName}
                  onChange={(e) => setInstallationSiteName(e.target.value)}
                  required
                  className="mt-1.5 bg-white"
                />
              </div>
              <div>
                <Label>Application Date *</Label>
                <div className="mt-1.5">
                  <DatePickerInput
                    value={applicationDate}
                    onChange={setApplicationDate}
                    placeholder="Select application date"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-5" />

          {/* Account Address */}
          <div className="p-4 mb-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Account Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="accountAddress">Address *</Label>
                <Input
                  id="accountAddress"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  required
                  className="mt-1.5 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="accountCity">City *</Label>
                <Input
                  id="accountCity"
                  value={accountCity}
                  onChange={(e) => setAccountCity(e.target.value)}
                  required
                  className="mt-1.5 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountState">State *</Label>
                  <Input
                    id="accountState"
                    value={accountState}
                    onChange={(e) => setAccountState(e.target.value)}
                    required
                    maxLength={2}
                    className="mt-1.5 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="accountZip">ZIP *</Label>
                  <Input
                    id="accountZip"
                    value={accountZip}
                    onChange={(e) => setAccountZip(e.target.value)}
                    required
                    maxLength={10}
                    className="mt-1.5 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-5" />

          {/* Mailing Address */}
          <div className="p-4 mb-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Mailing Address <span className="font-normal normal-case tracking-normal text-gray-400">(if different)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="mailingAddress">Address</Label>
                <Input
                  id="mailingAddress"
                  value={mailingAddress}
                  onChange={(e) => setMailingAddress(e.target.value)}
                  className="mt-1.5 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="mailingCity">City</Label>
                <Input
                  id="mailingCity"
                  value={mailingCity}
                  onChange={(e) => setMailingCity(e.target.value)}
                  className="mt-1.5 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mailingState">State</Label>
                  <Input
                    id="mailingState"
                    value={mailingState}
                    onChange={(e) => setMailingState(e.target.value)}
                    maxLength={2}
                    className="mt-1.5 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="mailingZip">ZIP</Label>
                  <Input
                    id="mailingZip"
                    value={mailingZip}
                    onChange={(e) => setMailingZip(e.target.value)}
                    maxLength={10}
                    className="mt-1.5 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-5" />

          {/* Contact Information */}
          <div className="p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="mt-1.5 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="mt-1.5 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                  className="mt-1.5 bg-white"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payee Information */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="mb-4">Payee Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="payeeName">Payee Name *</Label>
              <Input
                id="payeeName"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="payeePhone">Phone Number *</Label>
              <Input
                id="payeePhone"
                type="tel"
                value={payeePhone}
                onChange={(e) => setPayeePhone(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="payeeEmail">Email *</Label>
              <Input
                id="payeeEmail"
                type="email"
                value={payeeEmail}
                onChange={(e) => setPayeeEmail(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
          </div>
        </motion.div>

        {/* Measure Information */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="mb-4">Measure Information</h2>

          {/* Forklifts */}
          <div className="mb-6">
            <h3 className="text-sm mb-1">
              Battery Powered Electric Forklifts{" "}
              <span className="text-mass-save-green font-bold">
                — $6,000 rebate each
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              * Must be replacing a propane powered forklift or purchased in lieu
              of a propane powered forklift. Cannot replace an existing electric
              forklift.
            </p>
            <div className="space-y-3">
              {forklifts.map((f, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-mass-save-headline">
                      Forklift #{i + 1}
                    </span>
                    {forklifts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeForklift(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                      >
                        <Trash2Icon className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Purchase Date</Label>
                      <div className="mt-1.5">
                        <DatePickerInput
                          value={f.purchaseDate}
                          onChange={(val) =>
                            updateForklift(i, "purchaseDate", val)
                          }
                          placeholder="Select date"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={f.qty || ""}
                        onChange={(e) =>
                          updateForklift(
                            i,
                            "qty",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Purchase Price</Label>
                      <Input
                        value={f.purchasePrice}
                        onChange={(e) =>
                          updateForklift(i, "purchasePrice", e.target.value)
                        }
                        placeholder="$"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Manufacturer</Label>
                      <Input
                        value={f.manufacturer}
                        onChange={(e) =>
                          updateForklift(i, "manufacturer", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Model Number</Label>
                      <Input
                        value={f.modelNumber}
                        onChange={(e) =>
                          updateForklift(i, "modelNumber", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm text-gray-600">
                    Rebate:{" "}
                    <span className="font-semibold text-mass-save-green">
                      ${(f.qty * FORKLIFT_REBATE).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {forklifts.length < 3 && (
              <Button
                type="button"
                onClick={addForklift}
                className="mt-3 w-full h-11 bg-gradient-to-r from-mass-save-green/5 to-mass-save-green/10 text-mass-save-green border border-dashed border-mass-save-green/25 hover:from-mass-save-green/10 hover:to-mass-save-green/15 hover:border-mass-save-green/40 hover:shadow-sm font-semibold rounded-lg transition-all duration-200"
                variant="ghost"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Another Forklift
              </Button>
            )}
          </div>

          {/* Chargers */}
          <div className="mb-6">
            <h3 className="text-sm mb-1">
              High Frequency Battery Chargers{" "}
              <span className="text-mass-save-green font-bold">
                — $550 rebate each
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              ** Must be a high frequency battery charger with power conversion
              efficiency &ge; 0.9. Must be new equipment or replacing an
              existing SCR or Ferroresonant charger. Rated input power must be
              greater than 2 kW.
            </p>
            <div className="space-y-3">
              {chargers.map((c, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-mass-save-headline">
                      Charger #{i + 1}
                    </span>
                    {chargers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCharger(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                      >
                        <Trash2Icon className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Purchase Date</Label>
                      <div className="mt-1.5">
                        <DatePickerInput
                          value={c.purchaseDate}
                          onChange={(val) =>
                            updateCharger(i, "purchaseDate", val)
                          }
                          placeholder="Select date"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={c.qty || ""}
                        onChange={(e) =>
                          updateCharger(
                            i,
                            "qty",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Purchase Price</Label>
                      <Input
                        value={c.purchasePrice}
                        onChange={(e) =>
                          updateCharger(i, "purchasePrice", e.target.value)
                        }
                        placeholder="$"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Manufacturer</Label>
                      <Input
                        value={c.manufacturer}
                        onChange={(e) =>
                          updateCharger(i, "manufacturer", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Model Number</Label>
                      <Input
                        value={c.modelNumber}
                        onChange={(e) =>
                          updateCharger(i, "modelNumber", e.target.value)
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm text-gray-600">
                    Rebate:{" "}
                    <span className="font-semibold text-mass-save-green">
                      ${(c.qty * CHARGER_REBATE).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={addCharger}
              className="mt-3 w-full h-11 bg-gradient-to-r from-mass-save-green/5 to-mass-save-green/10 text-mass-save-green border border-dashed border-mass-save-green/25 hover:from-mass-save-green/10 hover:to-mass-save-green/15 hover:border-mass-save-green/40 hover:shadow-sm font-semibold rounded-lg transition-all duration-200"
              variant="ghost"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Another Charger
            </Button>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-mass-save-headline">Total Rebate</span>
              <span className="text-mass-save-green">
                ${totalRebate.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Customer Acceptance */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="mb-4">Customer Acceptance of Terms</h2>
          <p className="text-sm text-gray-600 mb-4">
            I certify that all statements and information, including
            attachments, made in this rebate form are correct, complete, true,
            and accurate to the best of my knowledge and that I have read and
            agree to the terms and conditions on this form.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="certName">Print Name *</Label>
              <Input
                id="certName"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="agreed"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              required
              className="mt-0.5"
            />
            <Label htmlFor="agreed" className="text-sm text-gray-600 font-normal cursor-pointer leading-snug">
              I have read and agree to the{" "}
              <a href="#terms" className="underline">
                terms and conditions
              </a>{" "}
              *
            </Label>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Button
            type="submit"
            size="lg"
            className="bg-mass-save-green hover:bg-mass-save-green-dark text-white font-bold px-12 py-6 text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            Submit Application
          </Button>
        </motion.div>

      </form>

      {/* Terms and Conditions */}
      <motion.footer
        id="terms"
        className="max-w-4xl mx-auto px-4 pt-12 pb-8 mt-4 border-t border-gray-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Terms and Conditions</h2>
        <div className="text-xs text-gray-400 space-y-4 leading-relaxed">
            <div>
              <p><strong>1. Incentives</strong></p>
              <p>Subject to these Terms &amp; Conditions, the Sponsor will pay Incentives to Customer for the installation of EEMs.</p>
            </div>

            <div>
              <p><strong>2. Definitions</strong></p>
              <p>(a) &quot;Approval Letter&quot; means the letter issued by Sponsor stating Sponsor&apos;s approval of Customer&apos;s application, the maximum approved Incentives, required date of EEM completion, any changes to Customer&apos;s application and any other requirements of the Sponsor related to the Incentives. The Approval Letter may also be referred to as, inter alia, an Offer Letter or Pre-Approval Letter.</p>
              <p>(b) &quot;Customer&quot; means the commercial and industrial (&quot;C&amp;I&quot;) customer maintaining an active account for service with either a gas or electric distribution company.</p>
              <p>(c) &quot;EEMs&quot; are those energy efficiency measures described in the Program Materials or other Custom Measures that may be approved by the Sponsor.</p>
              <p>(d) &quot;Facility&quot; means the Customer location in Massachusetts served by the Sponsor where EEMs are to be installed.</p>
              <p>(e) &quot;Incentives&quot; means those payments made by the Sponsor to Customer pursuant to the Program and these Terms and Conditions. Incentives may also be referred to as &quot;Rebates&quot;.</p>
              <p>(f) &quot;Mass Save Sponsor&quot; or &quot;Sponsor&quot; means The Berkshire Gas Company, or Cape Light Compact JPE, or Eversource Energy, or Liberty Utilities, or National Grid, or Unitil, as applicable. Mass Save Sponsor may also be referred to as &quot;Program Administrator&quot; or &quot;PA&quot;.</p>
              <p>(g) &quot;Minimum Requirements Document&quot; means the document setting forth the minimum requirements that may be required by the Sponsor, which, if so required, will be submitted with Customer&apos;s application and approved by Sponsor.</p>
              <p>(h) &quot;Program&quot; means any of the energy efficiency programs offered to a C&amp;I Customer by Sponsor.</p>
              <p>(i) &quot;PA&quot; or &quot;Program Administrator&quot; means The Berkshire Gas Company, or Cape Light Compact JPE, or Eversource Energy, or Liberty Utilities, or National Grid, or Unitil, as applicable.</p>
              <p>(j) &quot;Program Materials&quot; means the documents and information provided or made available by the Sponsor specifying the qualifying EEMs, technology requirements, costs and other Program requirements.</p>
            </div>

            <div>
              <p><strong>3. Application process and requirement for Sponsor approval</strong></p>
              <p>(a) The Customer shall submit a completed application to the Sponsor or rebate processer, as required. The Customer may be required to provide the Sponsor with additional information upon request by the Sponsor. For example, Customer will, upon request by the Sponsor, provide a copy of the as-built drawings and equipment submittals for the Facility after EEMs are installed. To the extent required by the Sponsor or by applicable law, regulation or code, this analysis shall be prepared by a Professional Engineer licensed in the state where the Facility is located.</p>
              <p>(b) To be eligible for gas funded EEMs, Customer must have an active natural gas account. To be eligible for electric funded EEMs, a Customer must have an active electric account. Customers must meet any additional eligibility requirements set forth in the Program Materials.</p>
              <p>(c) The Sponsor reserves the right to reject or modify Customer&apos;s application. The Sponsor may also require the Customer to execute additional agreements, or provide other documentation prior to Sponsor approval. If Sponsor approves Customer&apos;s application, Sponsor will provide Customer with the Approval Letter.</p>
              <p>(d) The Sponsor reserves the right to approve or disapprove of any application or proposed EEMs.</p>
              <p>(e) Sections 3(a)-(c) do not apply in the event that the Program Materials explicitly state that no Approval Letter is required for the Program. In such an event, Customer must submit to Sponsor the following: (i) completed and signed Program rebate form, (ii) original date receipts for purchase and installation of EEMs, and (iii) any other required information or documentation within such time as Program Materials indicate.</p>
            </div>

            <div>
              <p><strong>4. Pre- and post-installation verification; monitoring and inspection</strong></p>
              <p>(a) Customer shall cooperate and provide access to Facility and EEM for PA&apos;s pre-installation and post-installation verifications, where applicable. Such verifications must be completed to Sponsor&apos;s satisfaction.</p>
              <p>(b) Customer agrees that Sponsor may perform monitoring and inspection of the EEMs for a three-year period following completion of the installation to determine the actual demand reduction and energy savings.</p>
            </div>

            <div>
              <p><strong>5. Installation schedule requirements</strong></p>
              <p>Where applicable, if the Customer does not complete installation of the approved EEMs within the earlier of the completion date specified in the Approval Letter or application or twelve (12) months from the date the Sponsor issues written pre-approval of the EEM project, the Sponsor may terminate any obligation to make Incentive payments.</p>
            </div>

            <div>
              <p><strong>6. Incentive amounts, requirements for incentives and incentive payment conditions</strong></p>
              <p>(a) The Sponsor reserves the right to adjust and/or negotiate the Incentive amount. Sponsor will pay no more than the cost to Customer of purchasing and installing the EEM, the calculated incremental cost, the prescriptive rebate on the form, or the amount in the Approval Letter (unless such Approval Letter is not required), whichever is less.</p>
              <p>(b) Sponsor shall not be obligated to pay the Incentive amount until all the following conditions are met: (1) Sponsor approves Customer&apos;s application and provides the Approval Letter (unless an Approval Letter is not required by the terms of the Rebate), (2) satisfactory completion of pre-installation and post-installation verifications by Sponsor, where applicable, (3) purchase and installation of EEMs in accordance with Approval Letter, Program Materials, Minimum Requirements Document (where applicable), Customer&apos;s application, these Terms and Conditions, and any other required documents, (4) where applicable, all applicable permits, licenses and inspections have been obtained by Customer, (5) Sponsor&apos;s receipt of final drawings, operation and maintenance manuals, operator training, permit documents, and other reasonable documentation, where applicable, and (6) Sponsor&apos;s receipt of all invoices for the purchase and installation of the EEMs.</p>
              <p>(c) All EEM invoices will include, at the minimum, the model, quantity, labor, materials, and cost of each EEM and/or service, and will identify any applicable discounts or other incentives.</p>
              <p>(d) Sponsor reserves the right, in its sole discretion, to modify, withhold or eliminate the Incentive if the conditions set forth in Section 6(b) are not met.</p>
              <p>(e) Upon Sponsor&apos;s written request, Customer will be required to refund any Incentives paid in the event that Customer does not comply with these Terms and Conditions and Program requirements.</p>
              <p>(f) Sponsor shall use commercially reasonable efforts to pay the Incentive amount within forty-five (45) days after the date all conditions in Section 6(b) are met.</p>
            </div>

            <div>
              <p><strong>7. Contractor shared savings arrangements</strong></p>
              <p>If EEMs are being installed by a contractor under a shared savings arrangement, in which the contractor&apos;s compensation is based on the savings achieved, the Sponsor maintains the right to determine the cost of purchasing and installing the EEMs.</p>
            </div>

            <div>
              <p><strong>8. Maintenance of EEMs</strong></p>
              <p>Customer shall properly operate and maintain the EEMs in accordance with the manufacturer&apos;s recommendations and the terms thereof for the life of the equipment.</p>
            </div>

            <div>
              <p><strong>9. Program/terms and conditions changes</strong></p>
              <p>Program terms and materials (including these Terms &amp; Conditions) may be changed by the Sponsor at any time without notice. The Sponsor reserves the right, for any reason, to withhold approval of projects and any EEMs, and to cancel or alter the Program, at any time without notice. Approved applications will be processed under the Terms and Conditions and Program Materials in effect at the time of the Approval Letter.</p>
            </div>

            <div>
              <p><strong>10. Publicity of customer participation</strong></p>
              <p>The Customer grants to the Sponsor the absolute and irrevocable right to use and disclose for promotional and regulatory purposes (a) any information relating to the Customer&apos;s participation in the Program, including, without limitation, Customer&apos;s name, project energy savings, EEMs installed, and incentive amounts, and (b) any photographs taken of Customer, EEMs, or Facility in connection with the Program, in any medium now here or hereafter known.</p>
            </div>

            <div>
              <p><strong>11. Indemnification and limitation of the Sponsor&apos;s liability</strong></p>
              <p>To the fullest extent allowed by law, and except as the Commonwealth of Massachusetts and its agencies are precluded by Article 84 of the Amendments to the Massachusetts Constitution from pledging their credit without prior legislative authority, and the Commonwealth of Massachusetts&apos; cities and towns are precluded by Section 7 of Article 2 of the Amendments to the Massachusetts Constitution from pledging their credit without prior legislative authority, Customer shall indemnify, defend and hold harmless Sponsor, its affiliates and their respective contractors, officers, directors, members, employees, agents, representatives from and against any and all claims, damages, losses and expenses, including reasonable attorneys&apos; fees and costs incurred to enforce this indemnity, arising out of, resulting from, or related to the Program or the performance of any services or other work in connection with the Program, caused or alleged to be caused in whole or in part by any actual or alleged act or omission of the Customer, or any contractor, subcontractor, agent, or third party hired by or directly or indirectly under the control of the Customer, including any party directly or indirectly employed by or under the control of any such contractor, subcontractor, agent, or third party or any other party for whose acts any of them may be liable.</p>
              <p>To the fullest extent allowed by law, the Sponsor&apos;s aggregate liability, regardless of the number or size of the claims, shall be limited to paying approved Incentives in accordance with these Terms and Conditions and the Program Materials, and the Sponsor and its affiliates and their respective contractors, officers, directors, members, employees, agents, representatives shall not be liable to the Customer or any third party for any other obligation. To the fullest extent allowed by law and as part of the consideration for participation in the Program, the Customer waives and releases the Sponsor and its affiliates from all obligations (other than payment of an Incentive), and for any liability or claim associated with the EEMs, the performance of the EEMs, the Program, or these Terms and Conditions.</p>
            </div>

            <div>
              <p><strong>12. No warranties or representations by the Sponsor</strong></p>
              <p className="uppercase">(a) THE SPONSOR DOES NOT ENDORSE, GUARANTEE, OR WARRANT ANY CONTRACTOR, MANUFACTURER OR PRODUCT, AND THE SPONSOR MAKES NO WARRANTIES OR GUARANTEES IN CONNECTION WITH ANY PROJECT, OR ANY SERVICES PERFORMED IN CONNECTION HEREWITH OR THEREWITH, WHETHER STATUTORY, ORAL, WRITTEN, EXPRESS, OR IMPLIED, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THIS DISCLAIMER SHALL SURVIVE ANY CANCELLATION, COMPLETION, TERMINATION OR EXPIRATION OF THE CUSTOMER&apos;S PARTICIPATION IN THE PROGRAM. CUSTOMER ACKNOWLEDGES AND AGREES THAT ANY WARRANTIES PROVIDED BY ORIGINAL MANUFACTURERS&apos;, LICENSORS&apos;, OR PROVIDERS&apos; OF MATERIAL, EQUIPMENT, OR OTHER ITEMS PROVIDED OR USED IN CONNECTION WITH THE PROGRAM UNDER THESE TERMS AND CONDITIONS, INCLUDING ITEMS INCORPORATED IN THE PROGRAM, (&quot;THIRD PARTY WARRANTIES&quot;) ARE NOT TO BE CONSIDERED WARRANTIES OF THE SPONSOR AND THE SPONSOR MAKES NO REPRESENTATIONS, GUARANTEES, OR WARRANTIES AS TO THE APPLICABILITY OR ENFORCEABILITY OF ANY SUCH THIRD PARTY WARRANTIES. THE TERMS OF THIS SECTION SHALL GOVERN OVER ANY CONTRARY VERBAL STATEMENTS OR LANGUAGE APPEARING IN ANY SPONSOR&apos;S OTHER DOCUMENTS.</p>
              <p>(b) Review of the design and installation of EEMs by Sponsor is limited solely to determine whether Program requirements have been met and shall not constitute an assumption by Sponsor of liability with respect to the EEMs. Neither the Sponsor nor any of its employees or contractors is responsible for determining that the design, engineering or installation of the EEMs is proper or complies with any particular laws, codes, or industry standards. The Sponsor does not make any representations of any kind regarding the benefits or energy savings to be achieved by the EEMs or the adequacy or safety of the EEMs.</p>
              <p>(c) Sponsor is not a manufacturer of, or regularly engaged in the sale or distribution of, or an expert with regard to, any equipment or work.</p>
              <p>(d) No activity by the Sponsor includes any kind of safety, code or other compliance review.</p>
            </div>

            <div>
              <p><strong>13. Customer responsibilities</strong></p>
              <p>Customer is responsible for all aspects of the EEMs and related work including without limitation, (a) selecting and purchasing the EEMs, (b) selecting and contracting with the contractor(s), (c) ensuring contractor(s) are properly qualified, licensed and insured, (d) ensuring EEMs and installation of EEMs meet industry standards, Program requirements and applicable laws, regulations and codes, and (e) obtaining required permits and inspections. Sponsor reserves the right to (a) deny a vendor or contractor providing equipment or services, and (b) exclude certain equipment from the Program.</p>
            </div>

            <div>
              <p><strong>14. Removal of equipment</strong></p>
              <p>The Customer shall properly remove and dispose of or recycle the equipment, lamps and components in accordance with all applicable laws, and regulations and codes. Customer will not re-install any of removed equipment in the Commonwealth of Massachusetts or the service territory of any affiliate of the Sponsor, and assumes all risk and liability associated with the reuse and disposal thereof.</p>
            </div>

            <div>
              <p><strong>15. Energy benefits</strong></p>
              <p>As applicable, other than the (i) the energy cost savings realized by Customer, (ii) energy or ancillary service market revenue achieved through market sensitive dispatch, (iii) alternative energy credits, and (iv) renewable energy credits, the Sponsor has the unilateral rights to apply for any credits or payments resulting from the Program or EEMs. Such credits and payments include but are not limited to: (a) ISO-NE capacity, (b) forward capacity credits, (c) other electric or natural gas capacity and avoided cost payments or credits, (d) demand response Program payments. Except for the credits and payments set forth in (i)-(iv) of this Section, Customer agrees not to, directly or indirectly, file payments or credits associated with the Program or EEMs, and further will not consent to any other third party&apos;s right to such payments or credits without prior written consent from the Sponsor. Sponsor&apos;s rights under this Section are irrevocable for the life of the EEMs unless the Sponsor provides prior written consent.</p>
            </div>

            <div>
              <p><strong>16. Customer must declare and pay all taxes</strong></p>
              <p>The benefits conferred upon the Customer through participation in this Program may be taxable by the federal, state, and local government. The Customer is responsible for declaring and paying all such taxes. The Sponsor is not responsible for the payment of any such taxes.</p>
            </div>

            <div>
              <p><strong>17. Counterpart execution; scanned copy</strong></p>
              <p>Any and all Program related agreements and documents may be executed in several counterparts. A scanned or electronically reproduced copy or image of such agreements and documents bearing the signatures of the parties shall be deemed an original.</p>
            </div>

            <div>
              <p><strong>18. Miscellaneous</strong></p>
              <p>(a) Paragraph headings are for the convenience of the parties only and are not to be construed as part of these Terms and Conditions.</p>
              <p>(b) If any provision of these Terms and Conditions is deemed invalid by any court or administrative body having jurisdiction, such ruling shall not invalidate any other provision, and the remaining provisions shall remain in full force and effect in accordance with their terms.</p>
              <p>(c) These Terms and Conditions shall be interpreted and enforced according to the laws of the Commonwealth of Massachusetts. Any claim or action arising under or related to the Program or arising between the parties shall be brought and heard only in a court of competent jurisdiction located in the Commonwealth of Massachusetts.</p>
              <p>(d) In the event of any conflict or inconsistency between these Terms and Conditions and any Program Materials, these Terms and Conditions shall be controlling.</p>
              <p>(e) Except as expressly provided herein, there shall be no modification or amendment to these Terms and Conditions or the Program Materials unless such modification or amendment is in writing and signed by a duly authorized officer of the Sponsor.</p>
              <p>(f) Sections 4(b), 10, 11, 12, 14, 15 &amp; 18 shall survive the termination or expiration of the Customer&apos;s participation in the Program.</p>
            </div>
          </div>
        <p className="text-center text-xs text-gray-400 pt-8 pb-4">
          Mass Save&reg; {currentYear} &middot; Commercial Battery-Powered Forklifts
          and Forklift Battery Chargers
        </p>
      </motion.footer>
    </div>
  );
}
