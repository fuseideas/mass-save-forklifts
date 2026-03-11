"use client";

import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import DatePickerInput from "./components/DatePickerInput";

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
  };

  if (submitted) {
    const info = sponsor ? sponsorInfo[sponsor] : null;
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-lg w-full text-center">
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
          <p className="text-gray-600 mb-4">
            Your rebate application has been submitted successfully. Your
            estimated total rebate is{" "}
            <span className="font-bold text-mass-save-green">
              ${totalRebate.toLocaleString()}
            </span>
            .
          </p>
          {info && (
            <div className="bg-gray-50 rounded p-4 text-sm text-gray-600 border border-gray-200">
              <p className="font-semibold mb-1">
                Submit supporting documents to:
              </p>
              <p>{info.name}</p>
              <p>{info.phone}</p>
              <p>{info.email}</p>
            </div>
          )}
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-mass-save-green hover:text-mass-save-green-dark hover:underline text-sm font-medium"
          >
            Edit application
          </button>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
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
          <motion.span
            className="font-bold tracking-wide"
            animate={{ fontSize: scrolled ? "1.25rem" : "2.25rem" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {currentYear}
          </motion.span>
        </div>
      </motion.div>

      {/* Hero header with parallax */}
      <div ref={heroRef} className="relative w-full h-80 md:h-[28rem] overflow-hidden">
        <motion.img
          src="/header.jpg"
          alt="Forklift in warehouse"
          className="w-full h-full object-cover"
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
          {logos.map((logo, i) => (
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

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 px-4 py-8">
        {/* Instructions */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
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
            <div className="space-y-3">
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
              ].map((sponsor) => (
                <div
                  key={sponsor.name}
                  className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-mass-save-green"
                >
                  <p className="font-bold text-mass-save-headline text-sm">
                    {sponsor.name}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    <a
                      href={`tel:${sponsor.phone}`}
                      className="text-xs text-gray-500 hover:text-mass-save-green flex items-center gap-1.5 no-underline"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {sponsor.phone}
                    </a>
                    <a
                      href={`mailto:${sponsor.email}`}
                      className="text-xs text-gray-500 hover:text-mass-save-green flex items-center gap-1.5 no-underline"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {sponsor.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sponsor Selection */}
        <div className="card">
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
                className={`flex items-center gap-2 border rounded p-3 cursor-pointer transition-colors ${
                  sponsor === value
                    ? "border-mass-save-green bg-mass-save-green-light"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="sponsor"
                  value={value}
                  checked={sponsor === value}
                  onChange={(e) => setSponsor(e.target.value as Sponsor)}
                  required
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Electric Account Number *
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              placeholder="Enter your electric account number"
              className="max-w-md"
            />
          </div>
        </div>

        {/* Account Holder Information */}
        <div className="card">
          <h2 className="mb-4">Account Holder Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Installation Site Name *
              </label>
              <input
                type="text"
                value={installationSiteName}
                onChange={(e) => setInstallationSiteName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Application Date *
              </label>
              <DatePickerInput
                value={applicationDate}
                onChange={setApplicationDate}
                placeholder="Select application date"
                required
              />
            </div>
          </div>

          <h3 className="text-sm mt-6 mb-3">Account Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address *
              </label>
              <input
                type="text"
                value={accountAddress}
                onChange={(e) => setAccountAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                value={accountCity}
                onChange={(e) => setAccountCity(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={accountState}
                  onChange={(e) => setAccountState(e.target.value)}
                  required
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP *</label>
                <input
                  type="text"
                  value={accountZip}
                  onChange={(e) => setAccountZip(e.target.value)}
                  required
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <h3 className="text-sm mt-6 mb-3">
            Mailing Address{" "}
            <span className="font-normal text-gray-400">(if different)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={mailingAddress}
                onChange={(e) => setMailingAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={mailingCity}
                onChange={(e) => setMailingCity(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={mailingState}
                  onChange={(e) => setMailingState(e.target.value)}
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP</label>
                <input
                  type="text"
                  value={mailingZip}
                  onChange={(e) => setMailingZip(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <h3 className="text-sm mt-6 mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Payee Information */}
        <div className="card">
          <h2 className="mb-4">Payee Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Payee Name *
              </label>
              <input
                type="text"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={payeePhone}
                onChange={(e) => setPayeePhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={payeeEmail}
                onChange={(e) => setPayeeEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Measure Information */}
        <div className="card">
          <h2 className="mb-4">Measure Information</h2>

          {/* Forklifts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm">
                Battery Powered Electric Forklifts{" "}
                <span className="text-mass-save-green font-bold">
                  — $6,000 rebate each
                </span>
              </h3>
              {forklifts.length < 3 && (
                <button
                  type="button"
                  onClick={addForklift}
                  className="text-sm text-mass-save-green hover:text-mass-save-green-dark font-medium"
                >
                  + Add forklift
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-3">
              * Must be replacing a propane powered forklift or purchased in lieu
              of a propane powered forklift. Cannot replace an existing electric
              forklift.
            </p>
            <div className="space-y-3">
              {forklifts.map((f, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-mass-save-headline">
                      Forklift #{i + 1}
                    </span>
                    {forklifts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeForklift(i)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Purchase Date
                      </label>
                      <DatePickerInput
                        value={f.purchaseDate}
                        onChange={(val) =>
                          updateForklift(i, "purchaseDate", val)
                        }
                        placeholder="Select date"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Quantity
                      </label>
                      <input
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
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Purchase Price
                      </label>
                      <input
                        type="text"
                        value={f.purchasePrice}
                        onChange={(e) =>
                          updateForklift(i, "purchasePrice", e.target.value)
                        }
                        placeholder="$"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        value={f.manufacturer}
                        onChange={(e) =>
                          updateForklift(i, "manufacturer", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Model Number
                      </label>
                      <input
                        type="text"
                        value={f.modelNumber}
                        onChange={(e) =>
                          updateForklift(i, "modelNumber", e.target.value)
                        }
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
          </div>

          {/* Chargers */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm">
                High Frequency Battery Chargers{" "}
                <span className="text-mass-save-green font-bold">
                  — $550 rebate each
                </span>
              </h3>
              <button
                type="button"
                onClick={addCharger}
                className="text-sm text-mass-save-green hover:text-mass-save-green-dark font-medium"
              >
                + Add charger
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              ** Must be a high frequency battery charger with power conversion
              efficiency &ge; 0.9. Must be new equipment or replacing an
              existing SCR or Ferroresonant charger. Rated input power must be
              greater than 2 kW.
            </p>
            <div className="space-y-3">
              {chargers.map((c, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-mass-save-headline">
                      Charger #{i + 1}
                    </span>
                    {chargers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCharger(i)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Purchase Date
                      </label>
                      <DatePickerInput
                        value={c.purchaseDate}
                        onChange={(val) =>
                          updateCharger(i, "purchaseDate", val)
                        }
                        placeholder="Select date"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Quantity
                      </label>
                      <input
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
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Purchase Price
                      </label>
                      <input
                        type="text"
                        value={c.purchasePrice}
                        onChange={(e) =>
                          updateCharger(i, "purchasePrice", e.target.value)
                        }
                        placeholder="$"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        value={c.manufacturer}
                        onChange={(e) =>
                          updateCharger(i, "manufacturer", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Model Number
                      </label>
                      <input
                        type="text"
                        value={c.modelNumber}
                        onChange={(e) =>
                          updateCharger(i, "modelNumber", e.target.value)
                        }
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
        </div>

        {/* Customer Acceptance */}
        <div className="card">
          <h2 className="mb-4">Customer Acceptance of Terms</h2>
          <p className="text-sm text-gray-600 mb-4">
            I certify that all statements and information, including
            attachments, made in this rebate form are correct, complete, true,
            and accurate to the best of my knowledge and that I have read and
            agree to the terms and conditions on this form.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Print Name *
              </label>
              <input
                type="text"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                required
              />
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              I have read and agree to the{" "}
              <a href="#terms" className="underline">
                terms and conditions
              </a>{" "}
              *
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button type="submit" className="btn-primary">
            Submit Application
          </button>
        </div>

        {/* Terms and Conditions */}
        <div id="terms" className="card">
          <h2 className="mb-4">Terms and Conditions</h2>
          <div className="text-xs text-gray-500 space-y-3 max-h-96 overflow-y-auto pr-2">
            <p>
              <strong>1. Incentives</strong> — Subject to these Terms &amp;
              Conditions, the Sponsor will pay Incentives to Customer for the
              installation of EEMs.
            </p>
            <p>
              <strong>2. Definitions</strong> — &quot;Customer&quot; means the
              commercial and industrial (&quot;C&amp;I&quot;) customer
              maintaining an active account for service with either a gas or
              electric distribution company. &quot;EEMs&quot; are those energy
              efficiency measures described in the Program Materials.
              &quot;Facility&quot; means the Customer location in Massachusetts
              served by the Sponsor where EEMs are to be installed.
              &quot;Incentives&quot; means those payments made by the Sponsor to
              Customer pursuant to the Program. &quot;Mass Save Sponsor&quot; or
              &quot;Sponsor&quot; means The Berkshire Gas Company, Cape Light
              Compact JPE, Eversource Energy, Liberty Utilities, National Grid,
              or Unitil, as applicable.
            </p>
            <p>
              <strong>3. Application process</strong> — The Customer shall
              submit a completed application to the Sponsor or rebate processor,
              as required. To be eligible for electric funded EEMs, a Customer
              must have an active electric account.
            </p>
            <p>
              <strong>4. Verification</strong> — Customer shall cooperate and
              provide access to Facility and EEM for pre- and post-installation
              verifications. Customer agrees that Sponsor may perform monitoring
              and inspection of the EEMs for a three-year period following
              completion.
            </p>
            <p>
              <strong>5. Installation schedule</strong> — If the Customer does
              not complete installation within twelve (12) months from
              pre-approval, the Sponsor may terminate any obligation to make
              Incentive payments.
            </p>
            <p>
              <strong>6. Incentive amounts</strong> — Sponsor will pay no more
              than the cost to Customer of purchasing and installing the EEM, the
              calculated incremental cost, or the prescriptive rebate on the
              form, whichever is less.
            </p>
            <p>
              <strong>7-18.</strong> Additional terms cover contractor shared
              savings, maintenance of EEMs, program changes, publicity,
              indemnification, limitation of liability, warranties, customer
              responsibilities, removal of equipment, energy benefits, taxes,
              and miscellaneous provisions. See the full PDF for complete terms.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Mass Save&reg; {currentYear} &middot; Commercial Battery-Powered Forklifts
          and Forklift Battery Chargers &middot; January {currentYear}
        </p>
      </form>
    </div>
  );
}
