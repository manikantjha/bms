import Link from "next/link";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { NAME } from "@/config";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">{NAME}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Professional makeup artist specializing in bridal, party, and
              editorial looks. Making every face a masterpiece.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-white transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="hover:text-white transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 96387 99402</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@bhavanasmakeupstudio.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Surat, Gujarat</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={16} />
                <span>@bhavanasmakeupstudio</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/50">
          <p>
            &copy; {new Date().getFullYear()} {NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
