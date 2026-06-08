import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, History, ChevronDown, User, BriefcaseBusiness, BarChart3, MessageSquare, Hash } from "lucide-react";
import Navbar from "../components/layout/Navbar.tsx";
import AppCard from "../components/Card.tsx";
import AppButton from "../components/Button.tsx";
import AppBadge from "../components/Badge.tsx";
import { useInterview } from "../context/InterviewContext.tsx";
import type { InterviewConfig } from "../context/InterviewContext.tsx";

const JOB_ROLES = ["Software Engineer", "Designer", "Product Manager", "Data Scientist"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const INTERVIEW_TYPES = ["Technical", "Behavioral", "Mixed"];
const NUM_QUESTIONS = ["5", "7", "10"];

const SelectField = ({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
      {icon}
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pr-9 ${
          error ? "border-destructive" : "border-border hover:border-primary/50"
        } ${!value ? "text-muted-foreground" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { setConfig } = useInterview();
  const [pastSessions, setPastSessions] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<InterviewConfig>({
    name: "",
    jobRole: "",
    difficulty: "",
    interviewType: "",
    numQuestions: "",
  });
  const [errors, setErrors] = useState<Partial<InterviewConfig>>({});

  useEffect(() => {
    const sessions = parseInt(localStorage.getItem("intervue_sessions") || "0", 10);
    setPastSessions(sessions);
  }, []);

  const update = (key: keyof InterviewConfig) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<InterviewConfig> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.jobRole) newErrors.jobRole = "Please select a job role";
    if (!form.difficulty) newErrors.difficulty = "Please select a difficulty";
    if (!form.interviewType) newErrors.interviewType = "Please select interview type";
    if (!form.numQuestions) newErrors.numQuestions = "Please select number of questions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setConfig(form);
      navigate("/interview");
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-5xl flex-col items-center justify-center gap-10"
        >
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="max-w-3xl text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Interview Preparation
            </motion.div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Ace Your Next{" "}
              <span className="bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
                Interview
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Practice with AI-generated questions tailored to your role, difficulty, and interview style. Build confidence before the big day.
            </p>

            {/* Past Sessions Badge */}
            {pastSessions > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground"
              >
                <History className="h-4 w-4 text-primary" />
                <span>
                  You've completed{" "}
                  <strong className="text-foreground">{pastSessions}</strong>{" "}
                  past {pastSessions === 1 ? "session" : "sessions"}
                </span>
              </motion.div>
            )}
          </motion.section>

          {/* Configuration Card */}
          <motion.div variants={itemVariants} className="w-full max-w-2xl scroll-mt-24">
            <AppCard className="card-elevated rounded-[2rem] border border-border/30 bg-card p-7 shadow-2xl shadow-slate-950/20 sm:p-8" animate={false}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Configure Your Session</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in the details below to start your personalized interview.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name")(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className={`w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                      errors.name ? "border-destructive" : "border-border hover:border-primary/50"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Job Role"
                    icon={<BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />}
                    value={form.jobRole}
                    onChange={update("jobRole")}
                    options={JOB_ROLES}
                    placeholder="Select a role"
                    error={errors.jobRole}
                  />
                  <SelectField
                    label="Difficulty"
                    icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                    value={form.difficulty}
                    onChange={update("difficulty")}
                    options={DIFFICULTIES}
                    placeholder="Select difficulty"
                    error={errors.difficulty}
                  />
                  <SelectField
                    label="Interview Type"
                    icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
                    value={form.interviewType}
                    onChange={update("interviewType")}
                    options={INTERVIEW_TYPES}
                    placeholder="Select type"
                    error={errors.interviewType}
                  />
                  <SelectField
                    label="Number of Questions"
                    icon={<Hash className="h-4 w-4 text-muted-foreground" />}
                    value={form.numQuestions}
                    onChange={update("numQuestions")}
                    options={NUM_QUESTIONS}
                    placeholder="Select count"
                    error={errors.numQuestions}
                  />
                </div>

                {/* Preview Badges */}
                {(form.difficulty || form.interviewType) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-wrap gap-2"
                  >
                    {form.difficulty && <AppBadge>{form.difficulty}</AppBadge>}
                    {form.interviewType && <AppBadge>{form.interviewType}</AppBadge>}
                    {form.numQuestions && (
                      <AppBadge variant="default">{form.numQuestions} Questions</AppBadge>
                    )}
                  </motion.div>
                )}

                <AppButton
                  onClick={handleSubmit}
                  loading={loading}
                  size="lg"
                  className="w-full mt-4 rounded-[1.25rem]"
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? "Starting…" : "Start Interview"}
                </AppButton>
              </div>
            </AppCard>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground"
          >
            {[
              "+ AI-Generated Questions",
              "+ Role-Specific Practice",
              "+ Multiple Difficulty Levels",
              "+ Instant Feedback",
            ].map((f) => (
              <span
                key={f}
                className="rounded-full border border-border bg-card px-4 py-1.5"
              >
                {f}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
