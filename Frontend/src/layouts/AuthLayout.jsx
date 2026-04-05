import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import logoImage from '../assets/bg remove logo.png';

export default function AuthLayout() {
  const location = useLocation();
  const element = useOutlet();
  
  return (
    <main className="flex min-h-screen w-full overflow-hidden">
      {/* Left Side: Visual Sanctuary */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Serene Clinical Setting"
            className="w-full h-full object-cover grayscale-[20%] opacity-90"
            data-alt="Modern serene medical laboratory with soft blue natural lighting, high-end equipment in soft focus, and a peaceful professional clinical atmosphere"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxsH4BhNh226FHuR3w0dP4c65TlgncwwoOlckwZVynpBN6t1BwexwS-VGS7A1GimF64MDy6x649DwWWuk80DEMF5jCnHCGC9diLbQ3c8XgLpvSkiL-bCjnmrE0b4Ghh0b0hNlxLY3IaHR_0bDL4stWbd0Zi7fnwieVRH1OzMJGplzNMJxbapT7N8udKcmP3ENpBdedIvhJFBPjDFxncO7rhUc5gXguIiklPhwVYHZG-VfPvhFZrnYVHN-5F27VmmMYo4ZmViUzZUY"
          />
          {/* Tonal Depth Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10" />
        </div>
        <div className="relative z-10 p-10 xl:p-16 flex flex-col justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
               <img src={logoImage} alt="E-VEDA Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-on-surface">
              E-VEDA
            </span>
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-on-surface leading-tight mb-4 xl:mb-6">
              Predictive insights for{" "}
              <span className="text-primary">emotional equilibrium.</span>
            </h2>
            <p className="text-base xl:text-lg text-on-surface-variant leading-relaxed">
              Step back into your digital sanctuary. Our clinical-grade dashboard
              helps you navigate wellness with clarity and professional precision.
            </p>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="flex -space-x-3">
              <img
                className="w-10 h-10 rounded-full border-2 border-surface"
                data-alt="Female doctor smiling portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZFJMJHcwnI3oisRmAkizPSNjKTPHmDBu4P2iAMGhfr1aWqIJE51rt2Df5_ZLDkRb5ktVtp3HpxGwVsfCaW52nW8AnvP4ZY2Q0x_P8Q1wZ0YivhpifMhdmR2qHuMRfNzQMTvI6NxY4ClkTManxTmm7tCeaHi5A0bIoiKCuhjvzBl-jVU9x_lR1ib1snSzyjWbE0q0o_QPB9nV0b2Z2mZFhF8QjYf5qgzPBZj-UXVmyShEXWwVhywodu1OAlcyNsuT5d0tiS1Hf4Dg"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-surface"
                data-alt="Male healthcare professional portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJKCnxVAb7GivINGxmeoeQjSVvtAc8ksIGEGwoj45G-Xok3p5kPnkVklC-m7huf8-QKzn3xZOuNc-ziWmwRG6u7pfA7FaY0CEAaIV8YX04EMSTta9y_xoA6w6FWjCOrYnV9qQFvUb5YQvNzgQ5E0F0FOaCJ4I_DdgobJXUPdUOIwoSA746HFZDlrg0xHdmt3ekYFdMnhnuIhBQFJ6zrC3oWEHznZ4U71N0Pwh4tJGds_YoxVgUrEzBqbyoXIfVJmw1PqugKRpns08"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-surface"
                data-alt="Medical specialist portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_4zubEtE6zFLtqjtKJAqq5-OWBGJbtQIahIHSc_QeE4v8PRxDrShExDArcC1__UJc-PK_PUbz-9IpHPGovqnMcS8JwocnP9JA-sFRDWBBu-JUorj5saiUJuflv2NxrIw8DVyua-24pnHMTyW2QIJ33Vj0eWBQ34q3Q3Mk7xFxwlp6QM5oSs7xxuGUJLBsWn_ZvygZk_mzma-X8Q4M60YYxF6XygJzID8SZknO7COizjcvyQUB-9GQlPIh1URuy96FIj6hitTep6k"
              />
            </div>
            <p className="text-sm font-medium text-on-surface-variant">
              Trusted by 2,000+ practitioners
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Component Content Area */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-surface to-surface-container-low overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full flex justify-center"
          >
            {element ? React.cloneElement(element, { key: location.pathname }) : null}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
