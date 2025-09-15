"use client";

import LetterGlitch from "@/components/magicui/letter-glitch";
import { useState } from "react";

export default function LetterGlitchDemo() {
  const [config, setConfig] = useState({
    glitchSpeed: 50,
    smooth: true,
    centerVignette: false,
    outerVignette: true,
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Full screen background example */}
      <div className="fixed inset-0 z-0">
        <LetterGlitch
          glitchColors={['#F9620C', '#ff8c42', '#ffd166']} // Using your brand orange colors
          glitchSpeed={config.glitchSpeed}
          smooth={config.smooth}
          centerVignette={config.centerVignette}
          outerVignette={config.outerVignette}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-4">
          <h1 className="text-4xl font-pp-neue-bold text-white mb-4">
            Letter Glitch Effect
          </h1>
          <p className="text-white/80 mb-8 font-pp-neue">
            Matrix-style animated background with customizable colors and effects.
          </p>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-white text-sm font-pp-neue-medium mb-2 block">
                Glitch Speed: {config.glitchSpeed}ms
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={config.glitchSpeed}
                onChange={(e) => setConfig({ ...config, glitchSpeed: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-4">
              <label className="text-white flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.smooth}
                  onChange={(e) => setConfig({ ...config, smooth: e.target.checked })}
                  className="rounded"
                />
                <span className="font-pp-neue">Smooth Transitions</span>
              </label>

              <label className="text-white flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.centerVignette}
                  onChange={(e) => setConfig({ ...config, centerVignette: e.target.checked })}
                  className="rounded"
                />
                <span className="font-pp-neue">Center Vignette</span>
              </label>

              <label className="text-white flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.outerVignette}
                  onChange={(e) => setConfig({ ...config, outerVignette: e.target.checked })}
                  className="rounded"
                />
                <span className="font-pp-neue">Outer Vignette</span>
              </label>
            </div>
          </div>
        </div>

        {/* Examples showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 px-4 max-w-6xl">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <LetterGlitch
              glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
              glitchSpeed={30}
              smooth={true}
              className="absolute inset-0"
            />
            <div className="relative z-10 p-4 h-full flex items-end">
              <p className="text-white font-pp-neue-medium">Matrix Green</p>
            </div>
          </div>

          <div className="relative h-64 rounded-lg overflow-hidden">
            <LetterGlitch
              glitchColors={['#ff006e', '#fb5607', '#ffbe0b']}
              glitchSpeed={80}
              smooth={false}
              className="absolute inset-0"
            />
            <div className="relative z-10 p-4 h-full flex items-end">
              <p className="text-white font-pp-neue-medium">Cyberpunk</p>
            </div>
          </div>

          <div className="relative h-64 rounded-lg overflow-hidden">
            <LetterGlitch
              glitchColors={['#7209b7', '#560bad', '#480ca8']}
              glitchSpeed={100}
              smooth={true}
              centerVignette={true}
              className="absolute inset-0"
            />
            <div className="relative z-10 p-4 h-full flex items-end">
              <p className="text-white font-pp-neue-medium">Purple Haze</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}