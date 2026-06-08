import { motion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";
import Navbar from "../components/layout/Navbar.tsx";
import AppCard from "../components/Card.tsx";
import AppButton from "../components/Button.tsx";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background gradient-hero">
      <Navbar />

      <main className="mx-auto flex max-w-6xl justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-2xl"
        >
          <AppCard className="p-8 text-center" animate={false}>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Results Coming Soon</h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Your interview feedback and score summary will appear here after a completed session.
            </p>
            <div className="mt-7 flex justify-center">
              <AppButton disabled>
                <Sparkles className="h-4 w-4" />
                Generate Results
              </AppButton>
            </div>
          </AppCard>
        </motion.div>
      </main>
    </div>
  );
}
