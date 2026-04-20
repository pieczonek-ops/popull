import { X, Facebook, Twitter, Linkedin, Link2, Mail, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${window.location.origin}${window.location.pathname}${url}`;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2]',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-[#25D366]',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${fullUrl}`)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-on-surface-variant',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Sprawdź ten artykuł: ${fullUrl}`)}`
    },
    {
      name: 'SMS',
      icon: MessageSquare,
      color: 'bg-green-500',
      href: `sms:?body=${encodeURIComponent(`Sprawdź ten artykuł: ${fullUrl}`)}`
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-surface-container rounded-3xl p-8 z-[101] border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tight">Udostępnij artykuł</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`${option.color} p-4 rounded-2xl text-white group-hover:scale-110 transition-transform shadow-lg`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                    {option.name}
                  </span>
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Kopiuj link</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={fullUrl}
                  className="flex-1 bg-surface border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-primary/50"
                />
                <button 
                  onClick={copyToClipboard}
                  className="bg-primary text-on-primary p-3 rounded-xl hover:scale-105 transition-transform"
                >
                  {copied ? <div className="text-[10px] font-bold px-2">Skopiowano!</div> : <Link2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
