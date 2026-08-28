import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Headset } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FloatingContact = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const openQueryDialog = () => {
    closeMenu();
    setDialogOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-end gap-2 mb-1 pointer-events-auto"
          >
            <button
              onClick={openQueryDialog}
              className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-xl hover:bg-accent transition-colors"
            >
              <span className="text-sm font-medium">Send a query</span>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <Headset className="w-4 h-4 text-primary-foreground" />
              </div>
            </button>

            <a
              href="mailto:intervixa@gmail.com"
              onClick={closeMenu}
              className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-xl hover:bg-accent transition-colors"
            >
              <span className="text-sm font-medium">Email us</span>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <Mail className="w-4 h-4 text-primary-foreground" />
              </div>
            </a>

            <a
              href="https://chat.whatsapp.com/BJH7F9PNwCi1fM3QKHBDb3?s=cl&p=a&mlu=4"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-xl hover:bg-accent transition-colors"
            >
              <span className="text-sm font-medium">WhatsApp</span>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <WhatsAppIcon className="w-4 h-4 text-primary-foreground" />
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <button
        onClick={toggleMenu}
        className="pointer-events-auto h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground shadow-glow flex items-center justify-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={menuOpen ? "Close contact options" : "Open contact options"}
        aria-expanded={menuOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {menuOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default FloatingContact;
