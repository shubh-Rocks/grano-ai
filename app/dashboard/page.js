"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  CalendarCheck2,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Pill,
  UserPlus,
  Activity,
  TrendingUp,
  LayoutDashboard,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";

/* ---------- Design tokens (matching page.js) ---------- */
const INK = "#1C2033";
const PAPER = "#F4F5F7";
const MARIGOLD = "#E8A93B";
const MARIGOLD_DEEP = "#C9862A";
const MARIGOLD_PALE = "#F6D98B";

const INK_60 = "rgba(28,32,51,0.6)";
const INK_45 = "rgba(28,32,51,0.45)";
const INK_12 = "rgba(28,32,51,0.12)";
const INK_08 = "rgba(28,32,51,0.08)";

/* ---------- Motion tokens ---------- */
// A single, deliberate easing curve reused everywhere so the whole
// dashboard feels like it belongs to one hand rather than a grab-bag
// of default transitions.
const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 };

// Each top-level view gets a distinct entry direction so the transition
// itself communicates navigation: registration slides in from the right
// (you're moving forward into a task), a patient detail rises up from
// its card (you're drilling into something), and returning to monitoring
// reverses both.
const viewVariants = {
  monitoring: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  },
  registration: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 32 },
  },
  "patient-detail": {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 18 },
  },
};

// Helper to transform database patient to UI format
function transformPatient(dbPatient) {
  return {
    id: dbPatient.id ?? dbPatient._id?.toString?.() ?? dbPatient._id,
    name: dbPatient.name,
    phone: dbPatient.phone,
    medicines:
      dbPatient.medicines?.map((med) => ({
        id: med.id ?? med._id?.toString?.() ?? med._id,
        name: med.name,
        dose: med.dosageAmount || med.dosageInstructions,
        time: med.time,
        appearance: med.appearance,
      })) || [],
    recentCalls: dbPatient.recentCalls || [],
  };
}

function Grain() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 60,
        opacity: 0.035,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function StatusBadge({ status }) {
  const config = {
    taken: {
      icon: CheckCircle,
      color: "#10B981",
      bg: "rgba(16,185,129,0.12)",
      label: "Taken",
    },
    missed: {
      icon: XCircle,
      color: "#EF4444",
      bg: "rgba(239,68,68,0.12)",
      label: "Missed",
    },
    uncertain: {
      icon: AlertCircle,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.12)",
      label: "Uncertain",
    },
    no_answer: {
      icon: Phone,
      color: "#6B7280",
      bg: "rgba(107,114,128,0.12)",
      label: "No Answer",
    },
  };
  const { icon: Icon, color, bg, label } = config[status] || config.uncertain;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: bg, color }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {label}
    </span>
  );
}

function ConfidenceIndicator({ confidence }) {
  if (confidence === "high") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs"
        style={{ color: INK_60 }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#10B981" }}
        />
        High confidence
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs"
      style={{ color: INK_60 }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#F59E0B" }}
      />
      Low confidence
    </span>
  );
}

function PatientCard({ patient, onViewDetails }) {
  const latestCall = patient.recentCalls?.[0];
  const adherenceRate =
    patient.recentCalls?.length > 0
      ? Math.round(
          (patient.recentCalls.filter((c) => c.status === "taken").length /
            patient.recentCalls.length) *
            100,
        )
      : 0;

  return (
    <motion.div
      className="relative p-6 rounded-2xl border cursor-pointer"
      style={{ background: PAPER, borderColor: INK_12 }}
      onClick={() => onViewDetails(patient)}
      whileHover={{
        y: -4,
        borderColor: "rgba(232,169,59,0.45)",
        boxShadow: "0 24px 40px -22px rgba(28,32,51,0.28)",
      }}
      whileTap={{ y: -1, scale: 0.99 }}
      transition={SPRING}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* layoutId lets this circle morph smoothly into the detail
              view's avatar when a patient is opened, so the transition
              reads as "this card became this page" rather than a cut. */}
          <motion.div
            layoutId={`avatar-${patient.id}`}
            className="w-12 h-12 rounded-full flex items-center justify-center font-medium text-sm"
            style={{
              background: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
              color: INK,
            }}
          >
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </motion.div>
          <div>
            <h3 className="font-semibold text-base" style={{ color: INK }}>
              {patient.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: INK_60 }}>
              {patient.phone}
            </p>
          </div>
        </div>
        <motion.div whileHover={{ x: 3 }} transition={SPRING}>
          <ChevronRight size={18} color={INK_45} strokeWidth={2} />
        </motion.div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <p className="text-xs mb-1" style={{ color: INK_45 }}>
            Today&apos;s status
          </p>
          {latestCall ? (
            <StatusBadge status={latestCall.status} />
          ) : (
            <span className="text-xs" style={{ color: INK_45 }}>
              No calls yet
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs mb-1" style={{ color: INK_45 }}>
            5-day adherence
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: INK }}>
              {adherenceRate}%
            </span>
            <TrendingUp
              size={14}
              color={adherenceRate >= 80 ? "#10B981" : "#F59E0B"}
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 text-xs"
        style={{ color: INK_45 }}
      >
        <Clock size={13} strokeWidth={2} />
        {latestCall ? (
          <>
            Last call: {latestCall.date} at {latestCall.time}
          </>
        ) : (
          <>No calls recorded yet</>
        )}
      </div>
    </motion.div>
  );
}

function MonitoringView({ patients, onViewDetails, onAddPatient, loading }) {
  const totalCalls = patients.reduce(
    (sum, p) => sum + (p.recentCalls?.length || 0),
    0,
  );
  const takenCalls = patients.reduce(
    (sum, p) =>
      sum + (p.recentCalls?.filter((c) => c.status === "taken").length || 0),
    0,
  );
  const overallAdherence = totalCalls
    ? Math.round((takenCalls / totalCalls) * 100)
    : 0;

  const statCards = [
    {
      icon: Users,
      iconBg: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
      iconColor: INK,
      label: "Total Patients",
      value: patients.length,
    },
    {
      icon: CheckCircle,
      iconBg: "rgba(16,185,129,0.15)",
      iconColor: "#10B981",
      label: "Overall Adherence",
      value: `${overallAdherence}%`,
    },
    {
      icon: Activity,
      iconBg: "rgba(245,158,11,0.15)",
      iconColor: "#F59E0B",
      label: "Calls This Week",
      value: totalCalls,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-5 rounded-2xl border"
            style={{ background: PAPER, borderColor: INK_12 }}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: EASE },
              },
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: stat.iconBg }}
              >
                <stat.icon size={16} color={stat.iconColor} strokeWidth={2.2} />
              </div>
              <span className="text-sm" style={{ color: INK_60 }}>
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-semibold" style={{ color: INK }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Patients Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: INK }}>
            Your Patients
          </h2>
          <motion.button
            onClick={onAddPatient}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
              color: INK,
              boxShadow: "0 8px 20px -6px rgba(232,169,59,0.5)",
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Patient
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              className="animate-spin"
              size={32}
              style={{ color: MARIGOLD }}
            />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12" style={{ color: INK_60 }}>
            <p className="text-lg mb-2">No patients yet</p>
            <p className="text-sm">Add your first patient to get started</p>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
          >
            {patients.map((patient) => (
              <motion.div
                key={patient.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: EASE },
                  },
                }}
              >
                <PatientCard patient={patient} onViewDetails={onViewDetails} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function RegistrationView({ onCancel, onRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    medicines: [{ name: "", dose: "", time: "", appearance: "" }],
  });

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: "", dose: "", time: "", appearance: "" },
      ],
    });
  };

  const removeMedicine = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index),
    });
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index][field] = value;
    setFormData({ ...formData, medicines: newMedicines });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format phone number to E.164 format for India
    let formattedPhone = formData.phone.trim();
    if (!formattedPhone.startsWith("+")) {
      // Remove any spaces, dashes, or parentheses
      formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, "");

      // Validate phone number length
      if (formattedPhone.length < 10) {
        alert("Please enter a valid 10-digit phone number");
        return;
      }

      // Add +91 prefix if it's a 10-digit Indian number
      if (formattedPhone.length === 10) {
        formattedPhone = "+91" + formattedPhone;
      } else if (
        formattedPhone.length === 12 &&
        formattedPhone.startsWith("91")
      ) {
        formattedPhone = "+" + formattedPhone;
      } else if (
        formattedPhone.length === 13 &&
        formattedPhone.startsWith("+91")
      ) {
        // Already in correct format
      } else {
        alert("Please enter a valid Indian phone number (10 digits)");
        return;
      }
    }

    onRegister({
      ...formData,
      phone: formattedPhone,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
          }}
        >
          <UserPlus size={18} color={INK} strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: INK }}>
            Register New Patient
          </h2>
          <p className="text-sm" style={{ color: INK_60 }}>
            Add a family member and their medicine schedule
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <div
          className="p-6 rounded-2xl border"
          style={{ background: PAPER, borderColor: INK_12 }}
        >
          <h3 className="font-medium mb-4" style={{ color: INK }}>
            Patient Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: INK }}
              >
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: `1px solid ${INK_12}`,
                  color: INK,
                  "--tw-ring-color": MARIGOLD,
                }}
                placeholder="e.g., Ramesh Kaka"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: INK }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: `1px solid ${INK_12}`,
                  color: INK,
                  "--tw-ring-color": MARIGOLD,
                }}
                placeholder="9876543210"
              />
              <p className="text-xs mt-1" style={{ color: INK_45 }}>
                Will be auto-formatted to +91 format
              </p>
            </div>
          </div>
        </div>

        {/* Medicines */}
        <div
          className="p-6 rounded-2xl border"
          style={{ background: PAPER, borderColor: INK_12 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: INK }}>
              Medicines
            </h3>
            <motion.button
              type="button"
              onClick={addMedicine}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ color: INK, border: `1px solid ${INK_12}` }}
              whileHover={{ background: "#ffffff" }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={12} strokeWidth={2.5} />
              Add Medicine
            </motion.button>
          </div>

          <motion.div className="space-y-4" layout>
            <AnimatePresence initial={false}>
              {formData.medicines.map((medicine, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="p-4 rounded-xl border overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.4)",
                    borderColor: INK_08,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Pill size={16} color={MARIGOLD_DEEP} strokeWidth={2} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: INK }}
                      >
                        Medicine {index + 1}
                      </span>
                    </div>
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="text-xs transition-colors hover:opacity-70"
                        style={{ color: INK_45 }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: INK_60 }}
                      >
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        required
                        value={medicine.name}
                        onChange={(e) =>
                          updateMedicine(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: `1px solid ${INK_12}`,
                          color: INK,
                        }}
                        placeholder="e.g., Amlodipine"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: INK_60 }}
                      >
                        Dosage
                      </label>
                      <input
                        type="text"
                        required
                        value={medicine.dose}
                        onChange={(e) =>
                          updateMedicine(index, "dose", e.target.value)
                        }
                        className="w-full px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: `1px solid ${INK_12}`,
                          color: INK,
                        }}
                        placeholder="e.g., 5mg"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: INK_60 }}
                      >
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={medicine.time}
                        onChange={(e) =>
                          updateMedicine(index, "time", e.target.value)
                        }
                        className="w-full px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: `1px solid ${INK_12}`,
                          color: INK,
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: INK_60 }}
                      >
                        Appearance
                      </label>
                      <input
                        type="text"
                        required
                        value={medicine.appearance}
                        onChange={(e) =>
                          updateMedicine(index, "appearance", e.target.value)
                        }
                        className="w-full px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          border: `1px solid ${INK_12}`,
                          color: INK,
                        }}
                        placeholder="e.g., Small white round tablet"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <motion.button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-sm font-medium border"
            style={{ borderColor: INK_12, color: INK }}
            whileHover={{ background: "#ffffff" }}
            whileTap={{ scale: 0.96 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{
              background: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
              color: INK,
              boxShadow: "0 8px 20px -6px rgba(232,169,59,0.5)",
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
          >
            Register Patient
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}

const STATUS_DOT_COLOR = {
  taken: "#10B981",
  missed: "#EF4444",
  uncertain: "#F59E0B",
  no_answer: "#6B7280",
};

function SidebarNavItem({ icon: Icon, label, active, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
      style={{ color: active ? PAPER : INK_60 }}
    >
      {active && (
        <motion.span
          layoutId="sidebar-nav-pill"
          className="absolute inset-0 rounded-xl"
          style={{ background: INK, zIndex: 0 }}
          transition={SPRING}
        />
      )}
      <Icon size={18} strokeWidth={2.2} className="relative z-10 shrink-0" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="relative z-10 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function SidebarPatientRow({ patient, active, collapsed, onClick }) {
  const latestStatus = patient.recentCalls[0]?.status;
  return (
    <button
      onClick={onClick}
      title={collapsed ? patient.name : undefined}
      className="relative w-full flex items-center gap-3 px-3 py-2 rounded-xl"
      style={{ background: active ? INK_08 : "transparent" }}
    >
      <div className="relative shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-[11px]"
          style={{
            background: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
            color: INK,
          }}
        >
          {patient.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        {latestStatus && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
            style={{
              background:
                STATUS_DOT_COLOR[latestStatus] || STATUS_DOT_COLOR.uncertain,
              borderColor: PAPER,
            }}
          />
        )}
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden text-left"
            style={{ color: INK }}
          >
            {patient.name}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function Sidebar({
  collapsed,
  onToggle,
  view,
  setView,
  patients,
  selectedPatient,
  onSelectPatient,
  onAddPatient,
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 264 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="h-screen sticky top-0 shrink-0 flex flex-col border-r overflow-hidden"
      style={{ background: PAPER, borderColor: INK_12 }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-4 h-16 shrink-0"
        style={{ borderBottom: `1px solid ${INK_08}` }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold sahara-display shrink-0"
          style={{
            background: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
            color: INK,
          }}
        >
          S
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p
                className="font-medium tracking-tight text-base sahara-display leading-tight"
                style={{ color: INK }}
              >
                Sahara
              </p>
              <p className="text-[11px]" style={{ color: INK_45 }}>
                Dashboard
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1 shrink-0">
        <SidebarNavItem
          icon={LayoutDashboard}
          label="Monitoring"
          collapsed={collapsed}
          active={view === "monitoring" || view === "patient-detail"}
          onClick={() => setView("monitoring")}
        />
        <SidebarNavItem
          icon={UserPlus}
          label="Add Patient"
          collapsed={collapsed}
          active={view === "registration"}
          onClick={onAddPatient}
        />
      </nav>

      {/* Patient quick-list */}
      <div className="flex-1 min-h-0 flex flex-col px-3 pb-3">
        <div className="px-2 mb-2 h-5 flex items-center">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
                style={{ color: INK_45 }}
              >
                Patients
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
          {patients.map((patient) => (
            <SidebarPatientRow
              key={patient.id}
              patient={patient}
              collapsed={collapsed}
              active={
                view === "patient-detail" && selectedPatient?.id === patient.id
              }
              onClick={() => onSelectPatient(patient)}
            />
          ))}
        </div>
      </div>

      {/* Collapse toggle */}
      <div
        className="px-3 py-3 shrink-0"
        style={{ borderTop: `1px solid ${INK_08}` }}
      >
        <motion.button
          onClick={onToggle}
          whileHover={{ background: INK_08 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium"
          style={{ color: INK_60 }}
        >
          <motion.span
            className="shrink-0 flex"
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={SPRING}
          >
            <ChevronsLeft size={18} strokeWidth={2.2} />
          </motion.span>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}

function PatientDetailView({ patient, onBack }) {
  return (
    <div className="space-y-6">
      <motion.button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm"
        style={{ color: INK_60 }}
        whileHover={{ x: -3, opacity: 0.7 }}
      >
        <ArrowRight size={16} className="rotate-180" />
        Back to all patients
      </motion.button>

      {/* Patient Header */}
      <motion.div
        className="p-6 rounded-2xl border"
        style={{ background: PAPER, borderColor: INK_12 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Shares layoutId with the card avatar it was opened from,
                so it morphs into place instead of popping in. */}
            <motion.div
              layoutId={`avatar-${patient.id}`}
              className="w-16 h-16 rounded-full flex items-center justify-center font-medium text-lg"
              style={{
                background: `linear-gradient(150deg, ${MARIGOLD_PALE}, ${MARIGOLD})`,
                color: INK,
              }}
            >
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </motion.div>
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: INK }}>
                {patient.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: INK_60 }}>
                {patient.phone}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: INK_45 }}>
              5-day adherence
            </p>
            <p className="text-2xl font-semibold" style={{ color: INK }}>
              {Math.round(
                (patient.recentCalls.filter((c) => c.status === "taken")
                  .length /
                  patient.recentCalls.length) *
                  100,
              )}
              %
            </p>
          </div>
        </div>
      </motion.div>

      {/* Medicines */}
      <motion.div
        className="p-6 rounded-2xl border"
        style={{ background: PAPER, borderColor: INK_12 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE, delay: 0.06 }}
      >
        <h3
          className="font-semibold mb-4 flex items-center gap-2"
          style={{ color: INK }}
        >
          <Pill size={18} color={MARIGOLD_DEEP} strokeWidth={2} />
          Medicine Schedule
        </h3>
        <div className="space-y-3">
          {patient.medicines.map((medicine, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.4)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: INK_08 }}
                >
                  <CalendarCheck2 size={16} color={INK} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: INK }}>
                    {medicine.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: INK_60 }}>
                    {medicine.dose} · {medicine.appearance}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: INK }}>
                  {medicine.time}
                </p>
                <p className="text-xs" style={{ color: INK_45 }}>
                  Daily
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Call History */}
      <motion.div
        className="p-6 rounded-2xl border"
        style={{ background: PAPER, borderColor: INK_12 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE, delay: 0.12 }}
      >
        <h3
          className="font-semibold mb-4 flex items-center gap-2"
          style={{ color: INK }}
        >
          <Phone size={18} color={MARIGOLD_DEEP} strokeWidth={2} />
          Call History
        </h3>
        <div className="space-y-3">
          {patient.recentCalls.map((call, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.4)" }}
            >
              <div className="flex items-center gap-3">
                <StatusBadge status={call.status} />
                <div>
                  <p className="text-sm" style={{ color: INK }}>
                    {call.date}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: INK_60 }}>
                    {call.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ConfidenceIndicator confidence={call.confidence} />
                {!call.answered && (
                  <span className="text-xs" style={{ color: INK_45 }}>
                    Not answered
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const [view, setView] = useState("monitoring"); // monitoring | registration | patient-detail
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [caregiverId, setCaregiverId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Declared with useCallback (and defined before the effect that uses it)
  // so it can safely be listed in the effect's dependency array without
  // triggering a temporal-dead-zone reference error.
  const fetchPatients = useCallback(async () => {
    if (!caregiverId) {
      setPatients([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/patients?caregiverId=${caregiverId}`);
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data = await response.json();
      const transformed = data.map(transformPatient);
      setPatients(transformed);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  }, [caregiverId]);

  // Fetch patients on mount when a caregiver is available
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const fetchPatientDetails = async (patientId) => {
    try {
      if (!patientId) {
        throw new Error("Missing patient id");
      }

      const response = await fetch('/api/patients/' + encodeURIComponent(patientId));
      if (!response.ok) {
        const text = await response.text();
        console.error("Patient detail fetch failed:", response.status, text);
        throw new Error("Failed to fetch patient details");
      }

      const data = await response.json();
      return transformPatient(data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      return null;
    }
  };

const handleRegister = async (formData) => {
    try {
      const payload = {
        ...formData,
        caregiverId,
      };

      console.log("Sending registration payload:", payload);

      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Registration failed:", responseData);
        throw new Error(responseData.error || "Failed to create patient");
      }

      console.log("Registration successful:", responseData);
      const newPatient = transformPatient(responseData);
      setPatients([...patients, newPatient]);
      setView("monitoring");
    } catch (error) {
      console.error("Error registering patient:", error);
      alert(`Failed to register patient: ${error.message}`);
    }
  };

  const pageTitle = {
    monitoring: "Monitoring",
    registration: "Add Patient",
    "patient-detail": selectedPatient?.name || "Patient",
  }[view];

  return (
    <div
      style={{
        background: PAPER,
        color: INK,
        fontFamily: "Inter, ui-sans-serif, system-ui",
        minHeight: "100vh",
      }}
      className="flex"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');

        .sahara-display { font-family: 'Fraunces', serif; }

        button:focus-visible, input:focus-visible {
          outline: 2px solid ${MARIGOLD_DEEP};
          outline-offset: 3px;
          border-radius: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <Grain />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        view={view}
        setView={setView}
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatient={async (patient) => {
          const detailedPatient = await fetchPatientDetails(patient.id);
          if (detailedPatient) {
            setSelectedPatient(detailedPatient);
            setView("patient-detail");
          }
        }}
        onAddPatient={() => setView("registration")}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header
          className="sticky top-0 z-20 backdrop-blur-md h-16 flex items-center px-8"
          style={{
            background: "rgba(244,245,247,0.82)",
            borderBottom: `1px solid ${INK_08}`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={pageTitle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="text-lg font-semibold"
              style={{ color: INK }}
            >
              {pageTitle}
            </motion.h1>
          </AnimatePresence>
        </header>

        <main className="max-w-5xl mx-auto px-6 md:px-8 py-8 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              variants={viewVariants[view]}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: EASE }}
            >
              {view === "monitoring" && (
                <MonitoringView
                  patients={patients}
                  loading={loading}
                  onViewDetails={async (patient) => {
                    const detailedPatient = await fetchPatientDetails(
                      patient.id,
                    );
                    if (detailedPatient) {
                      setSelectedPatient(detailedPatient);
                      setView("patient-detail");
                    }
                  }}
                  onAddPatient={() => setView("registration")}
                />
              )}

              {view === "registration" && (
                <RegistrationView
                  onCancel={() => setView("monitoring")}
                  onRegister={handleRegister}
                />
              )}

              {view === "patient-detail" && selectedPatient && (
                <PatientDetailView
                  patient={selectedPatient}
                  onBack={() => setView("monitoring")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
