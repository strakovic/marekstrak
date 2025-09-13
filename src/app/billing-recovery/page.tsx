"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import NumberTicker from "@/components/magicui/number-ticker";

// Types
interface BillingEvent {
  id: string;
  errorType: string;
  retryCount: number;
  status: "detected" | "retrying" | "resolved" | "escalated";
  timestamp: number;
}

interface TableEvent {
  id: string;
  issue: string;
  status: "resolved" | "retrying" | "manual";
}

// Stage configuration
const stages = [
  { name: "Detected", color: "bg-red-500", status: "detected" },
  { name: "Retrying", color: "bg-yellow-500", status: "retrying" },
  { name: "Resolved", color: "bg-green-500", status: "resolved" },
  { name: "Escalated", color: "bg-gray-500", status: "escalated" },
] as const;

// Billing Event Flow Component
function BillingEventFlow() {
  const [events, setEvents] = useState<BillingEvent[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  useEffect(() => {
    // Generate initial events
    const initialEvents: BillingEvent[] = [
      { id: "#83312", errorType: "Timeout", retryCount: 3, status: "resolved", timestamp: Date.now() - 10000 },
      { id: "#83313", errorType: "Rate Limit", retryCount: 2, status: "retrying", timestamp: Date.now() - 5000 },
      { id: "#83314", errorType: "Invalid Token", retryCount: 1, status: "detected", timestamp: Date.now() - 2000 },
    ];
    setEvents(initialEvents);

    // Simulate event progression
    const interval = setInterval(() => {
      setEvents(prev => prev.map(event => {
        if (event.status === "detected" && Math.random() > 0.7) {
          return { ...event, status: "retrying", retryCount: event.retryCount + 1 };
        }
        if (event.status === "retrying" && Math.random() > 0.8) {
          return { ...event, status: "resolved" };
        }
        return event;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <h2 className="text-lg font-semibold mb-6 text-white">🧠 Billing Event Flow</h2>
      
      {/* Timeline */}
      <div className="relative h-24">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-700 -translate-y-1/2" />
        
        {/* Stages */}
        <div className="relative flex justify-between items-center h-full">
          {stages.map((stage, index) => (
            <div key={stage.name} className="relative flex flex-col items-center">
              {/* Stage dot */}
              <div className={cn(
                "w-4 h-4 rounded-full z-10",
                stage.color
              )} />
              {/* Stage label */}
              <span className="text-xs text-neutral-400 mt-2">{stage.name}</span>
              
              {/* Events at this stage */}
              <AnimatePresence>
                {events.filter(e => e.status === stage.status).map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    className="absolute"
                    initial={{ scale: 0, y: -20 }}
                    animate={{ 
                      scale: 1, 
                      y: -30 - (eventIndex * 15),
                      x: eventIndex * 10 - 5
                    }}
                    exit={{ scale: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onHoverStart={() => setHoveredEvent(event.id)}
                    onHoverEnd={() => setHoveredEvent(null)}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded-full cursor-pointer",
                      stage.color
                    )} />
                    
                    {/* Tooltip */}
                    {hoveredEvent === event.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs rounded-lg p-3 shadow-lg whitespace-nowrap z-20"
                      >
                        <div className="font-semibold">{event.id}</div>
                        <div className="text-neutral-400">Error: {event.errorType}</div>
                        <div className="text-neutral-400">Retries: {event.retryCount}</div>
                        <div className="text-neutral-400">Status: {event.status}</div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Recovery Stats Component
function RecoveryStats() {
  const stats = [
    { label: "Auto-Recovery Rate", value: 94.7, suffix: "%", icon: "✅" },
    { label: "Avg. Recovery Time", value: 3.1, suffix: " sec", icon: "⏱️" },
    { label: "Escalations (24h)", value: 2, suffix: "", icon: "⚠️" },
    { label: "Resolved Events (last 24h)", value: 322, suffix: "", icon: "✔️" },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold mb-6 text-white">📊 Recovery Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-neutral-800 p-6 flex items-start space-x-4"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-neutral-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">
                <NumberTicker value={stat.value} />
                <span className="text-xl font-normal">{stat.suffix}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Error Feed Table Component
function ErrorFeedTable() {
  const events: TableEvent[] = [
    { id: "#83315", issue: "Payment timeout", status: "resolved" },
    { id: "#83316", issue: "Invalid webhook signature", status: "retrying" },
    { id: "#83317", issue: "Rate limit exceeded", status: "manual" },
    { id: "#83318", issue: "Database connection lost", status: "resolved" },
    { id: "#83319", issue: "API key expired", status: "retrying" },
  ];

  const getStatusColor = (status: TableEvent["status"]) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "retrying":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "manual":
        return "bg-red-500/20 text-red-400 border-red-500/50";
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">📋 Error Feed</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Event ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Issue</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-neutral-800">
                <td className="py-3 px-4 text-sm font-mono text-white">{event.id}</td>
                <td className="py-3 px-4 text-sm text-neutral-300">{event.issue}</td>
                <td className="py-3 px-4">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", getStatusColor(event.status))}
                  >
                    {event.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Error Simulation Panel Component
function ErrorSimulationPanel() {
  const [selectedError, setSelectedError] = useState("timeout");
  const [simulationOutput, setSimulationOutput] = useState<string>("");

  const errorTypes = [
    { value: "timeout", label: "Timeout" },
    { value: "rule-conflict", label: "Rule Conflict" },
    { value: "rate-limit", label: "Rate Limit" },
    { value: "invalid-token", label: "Invalid Token" },
    { value: "webhook-failure", label: "Webhook Failure" },
  ];

  const simulateError = () => {
    const output = {
      event: "usage.charge.created",
      status: "retrying",
      attempts: 1,
      error: selectedError,
      timestamp: new Date().toISOString(),
    };
    setSimulationOutput(JSON.stringify(output, null, 2));
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">🔧 Error Simulation</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-neutral-400 mb-2 block">Error Type</label>
          <Select value={selectedError} onValueChange={setSelectedError}>
            <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              {errorTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-white">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={simulateError}
          className="w-full bg-brand hover:bg-brand/90 text-white"
        >
          Simulate Error
        </Button>
        
        {simulationOutput && (
          <div className="mt-4">
            <label className="text-sm text-neutral-400 mb-2 block">Output</label>
            <pre className="bg-neutral-800 rounded-lg p-4 text-sm text-green-400 font-mono overflow-x-auto">
              {simulationOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function BillingRecoveryDashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing Recovery Dashboard</h1>
        
        {/* Billing Event Flow */}
        <BillingEventFlow />
        
        {/* Recovery Stats */}
        <RecoveryStats />
        
        {/* Lower Section - Two Columns */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorFeedTable />
          <ErrorSimulationPanel />
        </div>
      </div>
    </div>
  );
}