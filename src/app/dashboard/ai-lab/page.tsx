"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RefreshCw, Play, CheckCircle2, Upload, Trash2, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent, sampleCatImages, sampleDogImages } from "@/lib/mockData";
import Image from "next/image";

type LabeledImage = { id: string; emoji: string; label: "Cat" | "Dog"; color: string };

type Phase = "collect" | "train" | "test" | "results";

export default function AILabPage() {
  const student = mockStudent;
  const [phase, setPhase] = useState<Phase>("collect");
  const [catImages, setCatImages] = useState<LabeledImage[]>([sampleCatImages[0] as LabeledImage, sampleCatImages[1] as LabeledImage]);
  const [dogImages, setDogImages] = useState<LabeledImage[]>([sampleDogImages[0] as LabeledImage, sampleDogImages[1] as LabeledImage]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number; other: number } | null>(null);
  const [selectedTestImage, setSelectedTestImage] = useState<string | null>(null);

  const addCat = () => {
    if (catImages.length < 6) {
      setCatImages(prev => [...prev, sampleCatImages[prev.length % sampleCatImages.length] as LabeledImage]);
    }
  };

  const addDog = () => {
    if (dogImages.length < 6) {
      setDogImages(prev => [...prev, sampleDogImages[prev.length % sampleDogImages.length] as LabeledImage]);
    }
  };

  const removeCat = (i: number) => setCatImages(prev => prev.filter((_, j) => j !== i));
  const removeDog = (i: number) => setDogImages(prev => prev.filter((_, j) => j !== i));

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80));
      setTrainingProgress(i);
    }
    setIsTraining(false);
    setPhase("test");
  };

  const testImage = (isdog: boolean) => {
    setSelectedTestImage(isdog ? "dog" : "cat");
    const isCatPrediction = !isdog || Math.random() > 0.3;
    setPrediction({
      label: isCatPrediction ? "Cat" : "Dog",
      confidence: isCatPrediction ? 87 + Math.floor(Math.random() * 10) : 82 + Math.floor(Math.random() * 12),
      other: isCatPrediction ? 13 : 18,
    });
    setPhase("results");
  };

  const resetExperiment = () => {
    setPhase("collect");
    setCatImages([sampleCatImages[0] as LabeledImage, sampleCatImages[1] as LabeledImage]);
    setDogImages([sampleDogImages[0] as LabeledImage, sampleDogImages[1] as LabeledImage]);
    setTrainingProgress(0);
    setPrediction(null);
    setSelectedTestImage(null);
  };

  const totalImages = catImages.length + dogImages.length;

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)" }}>
              🔬
            </div>
            <div>
              <h1 className="text-2xl font-900" style={{ color: "#172554" }}>Train Your Own AI</h1>
              <p className="text-slate-500 text-sm">Teach a computer to identify cats and dogs using images!</p>
            </div>
          </div>

          {/* Phase stepper */}
          <div className="flex items-center gap-2">
            {[
              { id: "collect", label: "1. Collect Data", icon: "📸" },
              { id: "train", label: "2. Train Model", icon: "🧠" },
              { id: "test", label: "3. Test", icon: "🧪" },
              { id: "results", label: "4. Improve", icon: "✨" },
            ].map((step, i, arr) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-700 ${
                  phase === step.id
                    ? "bg-violet-100 text-violet-700"
                    : ["test", "results"].includes(step.id) && ["collect", "train"].includes(phase)
                      ? "bg-slate-100 text-slate-400"
                      : "bg-green-100 text-green-700"
                }`}>
                  <span>{step.icon}</span>
                  <span className="hidden sm:block">{step.label}</span>
                </div>
                {i < arr.length - 1 && <div className="w-4 h-0.5 bg-slate-200" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Lab image banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl overflow-hidden mb-6 shadow-lg"
          style={{ maxHeight: 180 }}
        >
          <Image src="/images/ai_lab.jpg" alt="AI Lab" width={1200} height={400} className="w-full object-cover h-44" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── 1. Label Images ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <h2 className="font-800 text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 text-xs font-900 flex items-center justify-center">1</span>
              Label Images
            </h2>

            {/* Cats */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-700 text-slate-600">🐈 Cats ({catImages.length})</p>
                <motion.button
                  onClick={addCat}
                  disabled={catImages.length >= 6}
                  className="text-xs text-violet-600 font-700 flex items-center gap-1 hover:text-violet-800 disabled:opacity-40"
                  whileHover={{ scale: 1.05 }}
                >
                  <Plus size={12} /> Add
                </motion.button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {catImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group rounded-xl overflow-hidden aspect-square flex items-center justify-center text-3xl cursor-pointer border-2 border-yellow-200"
                    style={{ background: img.color }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {img.emoji}
                    <button
                      onClick={() => removeCat(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs items-center justify-center hidden group-hover:flex"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
                {catImages.length < 6 && (
                  <motion.button
                    onClick={addCat}
                    className="aspect-square rounded-xl border-2 border-dashed border-yellow-300 flex flex-col items-center justify-center text-yellow-400 hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Plus size={16} />
                    <span className="text-xs mt-0.5">Add</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Dogs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-700 text-slate-600">🐕 Dogs ({dogImages.length})</p>
                <motion.button
                  onClick={addDog}
                  disabled={dogImages.length >= 6}
                  className="text-xs text-blue-600 font-700 flex items-center gap-1 hover:text-blue-800 disabled:opacity-40"
                  whileHover={{ scale: 1.05 }}
                >
                  <Plus size={12} /> Add
                </motion.button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {dogImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group rounded-xl overflow-hidden aspect-square flex items-center justify-center text-3xl cursor-pointer border-2 border-blue-200"
                    style={{ background: img.color }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {img.emoji}
                    <button
                      onClick={() => removeDog(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs items-center justify-center hidden group-hover:flex"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
                {dogImages.length < 6 && (
                  <motion.button
                    onClick={addDog}
                    className="aspect-square rounded-xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-400 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Plus size={16} />
                    <span className="text-xs mt-0.5">Add</span>
                  </motion.button>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-violet-50 rounded-xl text-xs text-violet-600">
              <p className="font-700 mb-1">📊 Dataset: {totalImages} images</p>
              <p>Cats: {catImages.length} • Dogs: {dogImages.length}</p>
              <p className="text-violet-400 mt-1">Add more images for better accuracy!</p>
            </div>
          </motion.div>

          {/* ── 2. Train Model ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <h2 className="font-800 text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-green-100 text-green-700 text-xs font-900 flex items-center justify-center">2</span>
              Train Model
            </h2>

            {/* Training visual */}
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-5 mb-4 text-center">
              <motion.div
                animate={isTraining ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isTraining ? Infinity : 0, ease: "linear" }}
                className="text-6xl mb-3"
              >
                {isTraining ? "⚙️" : trainingProgress === 100 ? "🧠" : "🤖"}
              </motion.div>

              {isTraining ? (
                <div>
                  <p className="text-sm font-700 text-violet-700 mb-3">Training in progress...</p>
                  <div className="h-3 bg-violet-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #6941F5, #22C55E)", width: `${trainingProgress}%` }}
                      initial={{ width: "0%" }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{trainingProgress}% complete</p>
                  <p className="text-xs text-violet-500 mt-1">This might take a few seconds!</p>
                </div>
              ) : trainingProgress === 100 ? (
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <CheckCircle2 size={40} className="text-green-500 mx-auto mb-2" />
                  </motion.div>
                  <p className="text-sm font-700 text-green-700">Model trained! 🎉</p>
                  <p className="text-xs text-slate-500 mt-1">Your model is ready to test</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-700 text-slate-700 mb-1">Ready to train!</p>
                  <p className="text-xs text-slate-400">{totalImages} images collected</p>
                </div>
              )}
            </div>

            {/* Training stats */}
            {trainingProgress > 0 && (
              <div className="space-y-2 mb-4">
                {[
                  { label: "Accuracy", value: Math.min(trainingProgress + 20, 94), color: "#22C55E" },
                  { label: "Loss", value: Math.max(100 - trainingProgress, 8), color: "#EF4444", invert: true },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{stat.label}</span>
                      <span className="font-700">{stat.invert ? (100 - stat.value) / 100 : stat.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: stat.color, width: `${stat.invert ? 100 - stat.value : stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <motion.button
              onClick={startTraining}
              disabled={isTraining || totalImages < 4}
              className={`w-full py-3 rounded-2xl text-sm font-700 flex items-center justify-center gap-2 ${
                isTraining || totalImages < 4 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "btn-primary"
              }`}
              whileHover={!isTraining && totalImages >= 4 ? { scale: 1.03 } : {}}
              whileTap={!isTraining && totalImages >= 4 ? { scale: 0.97 } : {}}
            >
              {isTraining ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Training...
                </>
              ) : trainingProgress === 100 ? (
                <><RefreshCw size={16} /> Retrain Model</>
              ) : (
                <><Zap size={16} /> Train AI Model</>
              )}
            </motion.button>

            {totalImages < 4 && (
              <p className="text-xs text-amber-600 mt-2 text-center">Add at least 2 cats and 2 dogs to train</p>
            )}
          </motion.div>

          {/* ── 3. Test & Results ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <h2 className="font-800 text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-900 flex items-center justify-center">3</span>
              Test Your AI
            </h2>

            {trainingProgress < 100 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3 opacity-50">🔒</div>
                <p className="text-sm text-slate-400 font-600">Train your model first!</p>
              </div>
            ) : (
              <div>
                {/* Test images */}
                <p className="text-xs font-700 text-slate-500 mb-3">Click to test an image:</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { emoji: "🐈", label: "Try a Cat", isDog: false, color: "#FEF3C7", border: "#FDE68A" },
                    { emoji: "🐕", label: "Try a Dog", isDog: true, color: "#DBEAFE", border: "#BFDBFE" },
                    { emoji: "😸", label: "Kitten Test", isDog: false, color: "#D1FAE5", border: "#A7F3D0" },
                    { emoji: "🦮", label: "Labrador Test", isDog: true, color: "#EDE9FE", border: "#DDD6FE" },
                  ].map(test => (
                    <motion.button
                      key={test.label}
                      onClick={() => testImage(test.isDog)}
                      className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 text-3xl border-2 transition-all"
                      style={{ background: test.color, borderColor: test.border }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      {test.emoji}
                      <span className="text-xs text-slate-500 font-600">{test.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Prediction results */}
                <AnimatePresence>
                  {prediction && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-4 border border-violet-100"
                    >
                      <p className="text-xs font-700 text-violet-600 mb-2">🔮 Prediction</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-900 text-slate-800">{prediction.label}</span>
                        <span className="text-sm font-700 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {prediction.confidence}% confidence
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>🐕 Dog</span>
                            <span>{prediction.label === "Dog" ? prediction.confidence : prediction.other}%</span>
                          </div>
                          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${prediction.label === "Dog" ? prediction.confidence : prediction.other}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>🐈 Cat</span>
                            <span>{prediction.label === "Cat" ? prediction.confidence : prediction.other}%</span>
                          </div>
                          <div className="h-2 bg-yellow-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-yellow-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${prediction.label === "Cat" ? prediction.confidence : prediction.other}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <p className="text-xs text-green-600 font-600">Great! Your model is doing well! 🌟</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Reset */}
            <motion.button
              onClick={resetExperiment}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-700 border-2 border-slate-200 text-slate-500 flex items-center justify-center gap-2 hover:border-red-300 hover:text-red-500 transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <RefreshCw size={14} /> Reset Experiment
            </motion.button>
          </motion.div>
        </div>

        {/* Educational note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center"
        >
          <p className="text-xs text-violet-600">
            🔬 <strong>Note:</strong> This is a simulated ML experience. Real ML models require much more data and computing power,
            but the same principles apply! You are learning the actual workflow of a machine learning engineer.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
