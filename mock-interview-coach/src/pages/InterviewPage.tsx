import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  BriefcaseBusiness,
  BarChart3,
  MessageSquare,
  Hash,
  Sparkles,
  CircleCheck,
} from "lucide-react";
import Navbar from "../components/layout/Navbar.tsx";
import AppCard from "../components/Card.tsx";
import AppButton from "../components/Button.tsx";
import AppBadge from "../components/Badge.tsx";
import { useInterviewContext } from "../app/providers/InterviewProvider.tsx";

interface ConfigRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: boolean;
}

const ConfigRow = ({ icon, label, value, badge }: ConfigRowProps) => (
  <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
    <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        {icon}
      </span>
      <span className="font-medium text-foreground">{label}</span>
    </div>
    {badge ? (
      <AppBadge>{value}</AppBadge>
    ) : (
      <span className="truncate text-sm font-semibold text-foreground">{value}</span>
    )}
  </div>
);

export default function InterviewPage() {
  const navigate = useNavigate();
  const { setup } = useInterviewContext();

  useEffect(() => {
    if (!setup) {
      navigate("/");
    }
  }, [setup, navigate]);

  if (!setup) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-8"
        >
          <motion.div variants={itemVariants} className="w-full max-w-2xl">
            <AppButton
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Configuration
            </AppButton>
          </motion.div>

          <motion.section variants={itemVariants} className="max-w-2xl text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
            >
              <CircleCheck className="h-3.5 w-3.5" />
              Session Configured
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Begin,{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {setup.userName}!
              </span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Here's a summary of your interview session. Your AI interviewer is ready.
            </p>
          </motion.section>

          <motion.div variants={itemVariants} className="w-full max-w-2xl">
            <AppCard className="overflow-hidden" animate={false}>
              <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Interview Configuration</h2>
                  <p className="text-xs text-muted-foreground">Your selected preferences</p>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                  <AppBadge>{setup.difficulty}</AppBadge>
                  <AppBadge>{setup.interviewType}</AppBadge>
                </div>
              </div>

              <div className="px-6 py-2">
                <ConfigRow
                  icon={<User className="h-4 w-4" />}
                  label="Candidate"
                  value={setup.userName}
                />
                <ConfigRow
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                  label="Job Role"
                  value={setup.jobRole}
                />
                <ConfigRow
                  icon={<BarChart3 className="h-4 w-4" />}
                  label="Difficulty"
                  value={setup.difficulty}
                  badge
                />
                <ConfigRow
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Interview Type"
                  value={setup.interviewType}
                  badge
                />
                <ConfigRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Questions"
                  value={`${setup.questionCount} Questions`}
                />
              </div>
            </AppCard>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-2xl">
            <AppCard className="p-8 text-center" animate={false}>
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Interview Session Coming Soon
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                The AI interviewer is being prepared. This screen will host your live{" "}
                <strong className="text-foreground">{setup.questionCount}-question</strong>{" "}
                <strong className="text-foreground">{setup.interviewType}</strong> interview for a{" "}
                <strong className="text-foreground">{setup.jobRole}</strong> position.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <AppButton variant="secondary" onClick={() => navigate("/")}>
                  <ArrowLeft className="h-4 w-4" />
                  Change Settings
                </AppButton>
                <AppButton disabled size="md">
                  <Sparkles className="h-4 w-4" />
                  Launch Interview (Soon)
                </AppButton>
              </div>
            </AppCard>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              { label: "Clear voice", tip: "Speak clearly and at a measured pace." },
              { label: "Think aloud", tip: "Explain your reasoning as you answer." },
              { label: "Stay steady", tip: "Treat the session as focused practice." },
            ].map(({ label, tip }) => (
              <div key={tip} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{tip}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
