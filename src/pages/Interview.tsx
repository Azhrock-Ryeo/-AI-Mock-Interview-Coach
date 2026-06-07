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
import Navbar from "@/components/layout/Navbar";
import AppCard from "@/components/Card";
import AppButton from "@/components/Button";
import AppBadge from "@/components/Badge";
import { useInterview } from "@/context/InterviewContext";

interface ConfigRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: boolean;
}

const ConfigRow = ({ icon, label, value, badge }: ConfigRowProps) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
    <div className="flex items-center gap-3 text-sm text-muted-foreground min-w-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        {icon}
      </span>
      <span className="font-medium text-foreground">{label}</span>
    </div>
    {badge ? (
      <AppBadge>{value}</AppBadge>
    ) : (
      <span className="text-sm font-semibold text-foreground truncate">{value}</span>
    )}
  </div>
);

const Interview = () => {
  const navigate = useNavigate();
  const { config } = useInterview();

  useEffect(() => {
    if (!config) {
      navigate("/");
    }
  }, [config, navigate]);

  if (!config) return null;

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
          {/* Back Button */}
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

          {/* Header */}
          <motion.section variants={itemVariants} className="text-center max-w-2xl">
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
                {config.name}!
              </span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Here's a summary of your interview session. Your AI interviewer is ready.
            </p>
          </motion.section>

          {/* Config Summary Card */}
          <motion.div variants={itemVariants} className="w-full max-w-2xl">
            <AppCard className="overflow-hidden" animate={false}>
              {/* Card Header */}
              <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Interview Configuration</h2>
                  <p className="text-xs text-muted-foreground">Your selected preferences</p>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                  <AppBadge>{config.difficulty}</AppBadge>
                  <AppBadge>{config.interviewType}</AppBadge>
                </div>
              </div>

              {/* Config Rows */}
              <div className="px-6 py-2">
                <ConfigRow
                  icon={<User className="h-4 w-4" />}
                  label="Candidate"
                  value={config.name}
                />
                <ConfigRow
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                  label="Job Role"
                  value={config.jobRole}
                />
                <ConfigRow
                  icon={<BarChart3 className="h-4 w-4" />}
                  label="Difficulty"
                  value={config.difficulty}
                  badge
                />
                <ConfigRow
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Interview Type"
                  value={config.interviewType}
                  badge
                />
                <ConfigRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Questions"
                  value={`${config.numQuestions} Questions`}
                />
              </div>
            </AppCard>
          </motion.div>

          {/* Placeholder / Coming Soon */}
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
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                The AI interviewer is being prepared. This screen will host your live{" "}
                <strong className="text-foreground">{config.numQuestions}-question</strong>{" "}
                <strong className="text-foreground">{config.interviewType}</strong> interview for a{" "}
                <strong className="text-foreground">{config.jobRole}</strong> position.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
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

          {/* Tips */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-2xl grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              { emoji: "🎙️", tip: "Speak clearly and at a measured pace." },
              { emoji: "💡", tip: "Think aloud to show your reasoning." },
              { emoji: "🧘", tip: "Stay calm — it's a learning experience." },
            ].map(({ emoji, tip }) => (
              <div
                key={tip}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <div className="mb-2 text-2xl">{emoji}</div>
                <p className="text-xs text-muted-foreground">{tip}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Interview;