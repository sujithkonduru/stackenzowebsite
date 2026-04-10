import { Link, useLocation } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const services = [
    { name: "R&D", path: "/R_AND_D" },
    { name: "IT Services", path: "/WebServices" },
    { name: "Marketing", path: "/DigitalMarketing" },
    { name: "GSIN", path: "/Community" }
  ];

  const programs = [
    { name: "All Programs", path: "/Programs" },
    { name: "School Programs", path: "/Robotics" },
    { name: "College Programs", path: "/WorkShops" },
  ];

  const company = [
    { name: "About Us", path: "/About" },
    { name: "Career", path: "/Career" },
    { name: "Contact", path: "/Contact" }
  ];

  const legal = [
    { name: "Terms & Conditions", path: "/Terms" },
    { name: "Privacy Policy", path: "/Privacy" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/stackenzo", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/stackenzo", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/stackenzo", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/stackenzo", label: "Instagram" }
  ];

  return (
    <footer className="bg-[#FFF4ED] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12 text-center sm:text-center md:text-left">
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img 
          src="/images/logo for footer.png" 
          alt="Stackenzo" 
          className="h-8 sm:h-10 md:h-12 w-auto transition-opacity"
        />
              <p className="ml-6 m-0 text-lg sm:text-xl font-semibold text-[#1A1A1A]">
  Learn Build Inspire
</p>
            </Link>
            <div className="flex flex-col items-center md:items-start">
              <a
                href="mailto:hello@stackenzo.com"
                className="flex items-center gap-3 text-[#1A1A1A] hover:text-[#F04A06] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors border border-gray-200">
                  <Mail className="w-4 h-4 text-[#F04A06]" />
                </div>
                <span className="text-sm sm:text-base">hello@stackenzo.com</span>
              </a>
              <a
                href="tel:+919247577907"
                className="flex items-center gap-3 text-[#1A1A1A] hover:text-[#F04A06] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors border border-gray-200">
                  <Phone className="w-4 h-4 text-[#F04A06]" />
                </div>
                <span className="text-sm sm:text-base">+91 9247577907</span>
              </a>
              <div className="flex items-center gap-3 text-[#1A1A1A] group">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200">
                  <MapPin className="w-4 h-4 text-[#F04A06]" />
                </div>
                <span className="text-sm sm:text-base">Nellore, Andhra Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[#1A1A1A] font-semibold text-lg mb-4 relative inline-block">
              Services
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] rounded-full"></span>
            </h3>
            <ul className="space-y-3 mt-6">
              {services.map((service) => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="text-[#1A1A1A] hover:text-[#F04A06] transition-colors text-sm sm:text-base inline-block hover:translate-x-1 transform duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-[#1A1A1A] font-semibold text-lg mb-4 relative inline-block">
              Programs
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] rounded-full"></span>
            </h3>
            <ul className="space-y-3 mt-6">
              {programs.map((program) => (
                <li key={program.path}>
                  <Link
                    to={program.path}
                    className="text-[#1A1A1A] hover:text-[#F04A06] transition-colors text-sm sm:text-base inline-block hover:translate-x-1 transform duration-200"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[#1A1A1A] font-semibold text-lg mb-4 relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] rounded-full"></span>
            </h3>
            <ul className="space-y-3 mt-6">
              {company.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[#1A1A1A] hover:text-[#F04A06] transition-colors text-sm sm:text-base inline-block hover:translate-x-1 transform duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-[#1A1A1A] font-semibold text-lg mb-4 relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] rounded-full"></span>
            </h3>
            <ul className="space-y-3 mt-6 mb-8">
              {legal.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[#1A1A1A] hover:text-[#F04A06] transition-colors text-sm sm:text-base inline-block hover:translate-x-1 transform duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-[#1A1A1A] font-semibold text-lg mb-4 relative inline-block">
              Follow Us
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] rounded-full"></span>
            </h3>
            <div className="flex flex-row justify-center md:justify-start gap-3 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1A1A1A] hover:bg-[#F04A06] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border border-gray-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map Section - Full width with proper sizing */}
        {isHomePage && (
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
                <div className="aspect-[21/9] w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1462.208654815225!2d79.94902621077726!3d14.40748826002402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDI0JzI2LjkiTiA3OcKwNTYnNTcuMCJF!5e1!3m2!1sen!2sin!4v1775304227880!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Office Location"
                    className="w-full h-full"
                  />
                </div>

                {/* Map overlay with location info */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#D4AF37]/20">
                  <p className="text-sm font-medium text-[#F04A06] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    Our Headquarters
                  </p>
                  <p className="text-xs text-[#1A1A1A]">Nellore, Andhra Pradesh</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#1A1A1A] text-xs sm:text-sm order-2 md:order-1">
              © {new Date().getFullYear()} Stackenzo. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 order-1 md:order-2">
              <Link to="/Terms" className="text-[#1A1A1A] hover:text-[#F04A06] text-xs sm:text-sm transition-colors">
                Terms
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/Privacy" className="text-[#1A1A1A] hover:text-[#F04A06] text-xs sm:text-sm transition-colors">
                Privacy
              </Link>
            </div>
            <p className="text-[#1A1A1A] text-xs sm:text-sm order-3 flex items-center gap-1">
              Developed By Stackenzo
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;