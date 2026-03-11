"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, MenuIcon, XIcon, ZapIcon, BuildingIcon, FactoryIcon, LeafIcon, ThermometerIcon, SunIcon } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    title: "Commercial & Industrial",
    items: [
      {
        label: "Electric Forklifts & Chargers",
        href: "#",
        description: "Battery-powered forklift and charger rebates",
        icon: <ZapIcon className="w-5 h-5" />,
        active: true,
      },
      {
        label: "HVAC Equipment",
        href: "#",
        description: "High-efficiency heating and cooling systems",
        icon: <ThermometerIcon className="w-5 h-5" />,
      },
      {
        label: "Commercial Lighting",
        href: "#",
        description: "LED and lighting control upgrades",
        icon: <SunIcon className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Building Envelope",
    items: [
      {
        label: "Insulation & Air Sealing",
        href: "#",
        description: "Weatherization and insulation rebates",
        icon: <BuildingIcon className="w-5 h-5" />,
      },
      {
        label: "Windows & Doors",
        href: "#",
        description: "Energy-efficient window and door replacements",
        icon: <FactoryIcon className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Sustainability",
    items: [
      {
        label: "EV Charging Stations",
        href: "#",
        description: "Electric vehicle charging infrastructure",
        icon: <ZapIcon className="w-5 h-5" />,
      },
      {
        label: "Clean Energy Programs",
        href: "#",
        description: "Solar, wind, and renewable energy incentives",
        icon: <LeafIcon className="w-5 h-5" />,
      },
    ],
  },
];

export default function MegaMenu({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close desktop menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <>
      {/* Desktop menu */}
      <div
        ref={menuRef}
        className="hidden md:block relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors font-medium text-sm px-3 py-1.5 rounded-md hover:bg-white/10"
        >
          Applications
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-4 h-4" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-[640px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 grid grid-cols-3 gap-6">
                {menuData.map((category) => (
                  <div key={category.title}>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                      {category.title}
                    </h3>
                    <div className="space-y-1">
                      {category.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`group flex items-start gap-3 p-2.5 rounded-lg transition-all duration-150 no-underline ${
                            item.active
                              ? "bg-mass-save-green-light"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex-shrink-0 ${
                              item.active
                                ? "text-mass-save-green"
                                : "text-gray-400 group-hover:text-mass-save-green"
                            } transition-colors`}
                          >
                            {item.icon}
                          </span>
                          <div>
                            <p
                              className={`text-sm font-semibold leading-tight ${
                                item.active
                                  ? "text-mass-save-green"
                                  : "text-gray-800 group-hover:text-mass-save-green"
                              } transition-colors`}
                            >
                              {item.label}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Mass Save® Rebate Applications
                </span>
                <a
                  href="https://www.masssave.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-mass-save-green hover:text-mass-save-green-dark no-underline transition-colors"
                >
                  Visit MassSave.com →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-white p-2 -mr-2"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Mobile fullscreen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-bold text-mass-save-green text-lg">
                  Applications
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                  aria-label="Close menu"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {menuData.map((category) => (
                  <div key={category.title}>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                      {category.title}
                    </h3>
                    <div className="space-y-1">
                      {category.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-lg no-underline ${
                            item.active
                              ? "bg-mass-save-green-light"
                              : "active:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`mt-0.5 ${
                              item.active
                                ? "text-mass-save-green"
                                : "text-gray-400"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                item.active
                                  ? "text-mass-save-green"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 mt-4">
                <a
                  href="https://www.masssave.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-mass-save-green no-underline"
                >
                  Visit MassSave.com →
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
