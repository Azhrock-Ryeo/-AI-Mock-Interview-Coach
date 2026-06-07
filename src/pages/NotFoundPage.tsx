import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AppButton from "@/components/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <Navbar />

      <main className="flex flex-col items-center justify-center px-4 py-24 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col items-center gap-8 max-w-lg"
        >
          {/* 404 Illustration */}
          <div className="relative select-none">
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[7rem] sm:text-[9rem] font-black tracking-tighter leading-none"
            >
              <span className="bg-gradient-to-br from-primary via-purple-500 to-pink-400 bg-clip-text text-transparent">
                404
              </span>
            </motion.div>

            {/* Floating orbs */}
            <motion.div
              animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-6 h-10 w-10 rounded-full bg-primary/20 blur-md"
            />
            <motion.div
              animate={{ y: [8, -8, 8], x: [4, -4, 4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-2 -left-6 h-8 w-8 rounded-full bg-purple-400/20 blur-md"
            />
          </div>

          {/* Emoji */}
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl"
          >
            🔍
          </motion.div>

          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Page Not Found
            </h1>
            <p className="mt-3 text-muted-foreground text-base max-w-sm">
              Looks like this page went off-script. Even the AI couldn't find it — and it knows{" "}
              <em>everything</em>.
            </p>
          </div>

          {/* Dotted path visual */}
          <div className="flex items-center gap-2 text-muted-foreground/50 text-sm">
            <span className="rounded-full border border-dashed border-border/60 px-3 py-1">You</span>
            <span>···→···</span>
            <span className="rounded-full border border-dashed border-border/60 px-3 py-1 line-through">
              ???
            </span>
            <span>···→···</span>
            <span className="rounded-full border border-primary/40 bg-accent px-3 py-1 text-accent-foreground">
              Home
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <AppButton size="lg" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" />
              Go Home
            </AppButton>
            <AppButton variant="secondary" size="lg" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </AppButton>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Intervue · Interview Prep Platform
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFoundPage;