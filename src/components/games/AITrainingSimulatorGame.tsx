"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Trophy,
  ArrowRight,
  Sliders,
  Cpu,
  BarChart2,
  AlertTriangle,
} from "lucide-react";

export interface TrainingSample {
  id: string;
  title: string;
  icon: string;
  features: Record<string, string | number>;
  correctClass: string;
}

export interface InferenceTestCase {
  id: string;
  title: string;
  icon: string;
  features: Record<string, string | number>;
  expectedClass: string;
  isEdgeCase?: boolean;
  edgeCaseExplanation?: string;
}

export interface AITrainingConfig {
  targetLabel?: string;
  sampleData: TrainingSample[];
  classes: string[];
  testCases: InferenceTestCase[];
  evaluationCriteria?: string;
  title?: string;
}

interface AITrainingSimulatorGameProps {
  config: AITrainingConfig;
  onComplete: (score: number) => void;
  onAskTara?: (prompt: string) => void;
}

export default function AITrainingSimulatorGame({
  config,
  onComplete,
  onAskTara,
}: AITrainingSimulatorGameProps) {
  const classes = config.classes || ["Cat", "Dog"];
  const sampleData = config.sampleData || [];
  const testCases = config.testCases || [];

  // Stage 1: "label" | Stage 2: "train" | Stage 3: "infer" | Stage 4: "audit"
  const [stage, setStage] = useState<"label" | "train" | "infer" | "audit">("label");

  // User labeling state: sampleId -> chosenClass
  const [userLabels, setUserLabels] = useState<Record<string, string>>({});
  const [labelErrors, setLabelErrors] = useState<Record<string, boolean>>({});

  // Training state
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [epochs, setEpochs] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0.85);
  const [accuracy, setAccuracy] = useState<number>(50);
  const [isTraining, setIsTraining] = useState<boolean>(false);

  // Inference state
  const [testResults, setTestResults] = useState<
    Record<string, { predicted: string; confidence: number; correct: boolean }>
  >({});
  const [testedCount, setTestedCount] = useState<number>(0);

  // Score
  const [score, setScore] = useState<number>(100);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Handle label selection
  const handleAssignLabel = (sampleId: string, className: string) => {
    setUserLabels((prev) => ({ ...prev, [sampleId]: className }));
  };

  // Verify labels before training
  const handleVerifyLabelsAndTrain = async () => {
    let mistakes = 0;
    const errors: Record<string, boolean> = {};

    sampleData.forEach((sample) => {
      const assigned = userLabels[sample.id];
      if (assigned !== sample.correctClass) {
        mistakes++;
        errors[sample.id] = true;
      }
    });

    setLabelErrors(errors);

    if (mistakes > 0) {
      setScore((s) => Math.max(70, s - 10));
      // Give feedback but let them proceed or correct
      setTimeout(() => startTrainingLoop(), 900);
    } else {
      startTrainingLoop();
    }
  };

  // Run simulated training loop
  const startTrainingLoop = async () => {
    setStage("train");
    setIsTraining(true);
    setTrainingProgress(0);

    for (let ep = 1; ep <= 10; ep++) {
      await new Promise((r) => setTimeout(r, 180));
      setEpochs(ep);
      setTrainingProgress(ep * 10);
      setLoss((prev) => Math.max(0.04, +(prev * 0.72).toFixed(2)));
      setAccuracy((prev) => Math.min(98, prev + 5));
    }

    setIsTraining(false);
    setStage("infer");
  };

  // Run inference on a test case
  const handleRunInference = (tc: InferenceTestCase) => {
    // Generate realistic confidence
    const confidence = tc.isEdgeCase ? 58 : Math.floor(Math.random() * 8 + 92);
    const predicted = tc.isEdgeCase ? (Math.random() > 0.5 ? tc.expectedClass : "Unknown") : tc.expectedClass;
    const isCorrect = predicted === tc.expectedClass;

    setTestResults((prev) => ({
      ...prev,
      [tc.id]: { predicted, confidence, correct: isCorrect },
    }));

    setTestedCount((c) => c + 1);

    if (testedCount + 1 >= testCases.length) {
      setTimeout(() => setStage("audit"), 1000);
    }
  };

  const handleFinish = () => {
    onComplete(score);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-800 uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Machine Learning Simulator
            </span>
            <span className="text-xs font-700 text-slate-400">
              Interactive Model Pipeline
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-900 text-slate-800">
            {config.title || "AI Training Studio"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Label dataset samples, train neural weights, and test accuracy on unseen data!
          </p>
        </div>

        {/* 4-Stage Stepper Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-800 ${
              stage === "label" ? "bg-violet-600 text-white shadow-xs" : "text-slate-500"
            }`}
          >
            1. Label Data
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-800 ${
              stage === "train" ? "bg-violet-600 text-white shadow-xs" : "text-slate-500"
            }`}
          >
            2. Train
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-800 ${
              stage === "infer" ? "bg-violet-600 text-white shadow-xs" : "text-slate-500"
            }`}
          >
            3. Test Inference
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-800 ${
              stage === "audit" ? "bg-violet-600 text-white shadow-xs" : "text-slate-500"
            }`}
          >
            4. Edge Cases
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
        <Sparkles size={16} className="text-blue-600 flex-shrink-0" />
        <span>
          <b>Educational Simulation:</b> This simulates how real neural networks update weights across training epochs and evaluate confidence scores.
        </span>
      </div>

      {/* STAGE 1: LABELING SAMPLES */}
      {stage === "label" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-800 text-slate-500 uppercase tracking-wide">
              Step 1: Supervised Labeling (Assign correct classes)
            </span>
            <span className="text-xs font-700 text-slate-400">
              Labeled: {Object.keys(userLabels).length} / {sampleData.length}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {sampleData.map((sample) => {
              const assigned = userLabels[sample.id];
              const hasError = labelErrors[sample.id];

              return (
                <div
                  key={sample.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                    hasError
                      ? "border-rose-300 bg-rose-50/50"
                      : assigned
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl select-none">{sample.icon}</span>
                    <div>
                      <h4 className="text-sm font-800 text-slate-800">{sample.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(sample.features).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-[10px] font-700 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                          >
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Class assignment buttons */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Assign:</span>
                    {classes.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => handleAssignLabel(sample.id, cls)}
                        className={`px-3 py-1 rounded-xl text-xs font-800 transition-all cursor-pointer ${
                          assigned === cls
                            ? "bg-violet-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-violet-300"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleVerifyLabelsAndTrain}
            disabled={Object.keys(userLabels).length < sampleData.length}
            className="w-full btn-primary py-3.5 rounded-2xl text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md mt-2"
          >
            All Samples Labeled — Start Model Training 🚀
          </button>
        </div>
      )}

      {/* STAGE 2: TRAINING SIMULATION */}
      {stage === "train" && (
        <div className="p-8 bg-slate-50/90 rounded-3xl border border-slate-200/80 text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full bg-violet-600 text-white flex items-center justify-center mx-auto text-3xl shadow-lg"
          >
            ⚙️
          </motion.div>

          <div>
            <h3 className="text-xl font-900 text-slate-800">
              {isTraining ? `Training Epoch ${epochs}/10 in Progress...` : "Neural Training Converged!"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Calculating gradient descent, minimizing cross-entropy loss, and tuning internal synaptic weights.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-800 text-slate-600">
              <span>Epoch: {epochs}/10</span>
              <span>Loss: {loss}</span>
              <span>Accuracy: {accuracy}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: INFERENCE TESTING */}
      {stage === "infer" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-800 text-slate-500 uppercase tracking-wide">
              Step 3: Model Inference on Unseen Test Samples
            </span>
            <span className="text-xs font-700 text-slate-400">
              Tested: {testedCount} / {testCases.length}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {testCases.map((tc) => {
              const res = testResults[tc.id];

              return (
                <div
                  key={tc.id}
                  className="p-4 rounded-2xl border-2 border-slate-200 bg-white flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl select-none">{tc.icon}</span>
                    <div>
                      <h4 className="text-sm font-800 text-slate-800">{tc.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Features: {JSON.stringify(tc.features).replace(/["{}]/g, "")}
                      </p>
                    </div>
                  </div>

                  {res ? (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Predicted Class:</span>
                        <p className="text-xs font-900 text-slate-800">{res.predicted}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence:</span>
                        <p className="text-xs font-900 text-violet-700">{res.confidence}%</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRunInference(tc)}
                      className="w-full py-2.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white font-800 text-xs transition-all cursor-pointer"
                    >
                      Run Inference Test ➔
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 4: AUDIT & LIMITATIONS */}
      {stage === "audit" && (
        <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={20} />
            <h3 className="text-base sm:text-lg font-900 text-amber-950">
              Model Evaluation & Edge Case Audit
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            Congratulations! Your trained model successfully recognized typical patterns. However, notice how confidence drops on unusual or blurred samples (edge cases). This demonstrates why AI models require diverse training datasets and human oversight!
          </p>

          <button
            onClick={handleFinish}
            className="w-full btn-primary py-3.5 rounded-2xl text-sm font-800 shadow-md cursor-pointer"
          >
            Claim Lab XP & Complete Mission 🚀
          </button>
        </div>
      )}
    </div>
  );
}
