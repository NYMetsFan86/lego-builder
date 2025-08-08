"use client";
import { useState } from "react";
import { BRICK_LIBRARY, BrickSize, COLORS, ColorKey } from "@/lib/lego/bricks";
import { useBuilderStore } from "@/store/useBuilderStore";
import { saveToLocalStorage } from "@/lib/io/serialize";

export default function Palette() {
  const { 
    selectedSize, setSelectedSize, selectedColor, setSelectedColor, 
    rotation, rotateCW, baseplate, setBaseplate, bricks, clear, save 
  } = useBuilderStore();

  const [downloadHref, setDownloadHref] = useState<string | null>(null);

  const onExport = () => {
    const data = JSON.stringify({ bricks, baseplate }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setDownloadHref(url);
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(t => {
      const scene = JSON.parse(t);
      const { loadScene } = useBuilderStore.getState();
      loadScene(scene);
      saveToLocalStorage(scene);
    });
  };

  // Group bricks by kind
  const bricksByKind = BRICK_LIBRARY.reduce((acc, brick) => {
    if (!acc[brick.kind]) acc[brick.kind] = [];
    acc[brick.kind].push(brick);
    return acc;
  }, {} as Record<string, BrickSize[]>);

  const brickCount = bricks.length;
  const totalStuds = bricks.reduce((sum, b) => sum + (b.size.w * b.size.l), 0);

  return (
    <div className="fade-in">
      {/* Brick Selection */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>🧱</span>
            Brick Type
          </h3>
          <button 
            className="icon-button tooltip" 
            onClick={rotateCW}
            data-tooltip="Rotate (R)"
            style={{ background: rotation > 0 ? "var(--accent)" : undefined }}
          >
            {rotation}°
          </button>
        </div>
        
        {Object.entries(bricksByKind).map(([kind, bricks]) => (
          <div key={kind} style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 12, textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
              {kind}s
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {bricks.map(brick => {
                const isSelected = selectedSize === brick;
                return (
                  <button
                    key={`${brick.kind}-${brick.w}x${brick.l}`}
                    onClick={() => setSelectedSize(brick)}
                    style={{
                      background: isSelected ? "var(--accent)" : "var(--panel)",
                      borderColor: isSelected ? "var(--accent)" : "var(--border)",
                      padding: "12px",
                      fontSize: 14,
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    {brick.w}×{brick.l}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Color Selection */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>🎨</span>
            Color
          </h3>
        </div>
        <div className="color-grid">
          {(Object.keys(COLORS) as ColorKey[]).map(k => (
            <button 
              key={k} 
              onClick={() => setSelectedColor(k)}
              className={`color-button tooltip ${selectedColor === k ? 'selected' : ''}`}
              style={{ background: COLORS[k] }}
              data-tooltip={k.charAt(0).toUpperCase() + k.slice(1)}
            />
          ))}
        </div>
      </div>

      {/* Baseplate */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>◻️</span>
            Baseplate
          </h3>
        </div>
        <select 
          value={baseplate} 
          onChange={e => setBaseplate(e.target.value as any)}
        >
          <option value="small">Small (16×16)</option>
          <option value="medium">Medium (32×32)</option>
          <option value="large">Large (48×48)</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>📊</span>
            Statistics
          </h3>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-value">{brickCount}</div>
            <div className="stat-label">Bricks</div>
          </div>
          <div className="stat">
            <div className="stat-value">{totalStuds}</div>
            <div className="stat-label">Total Studs</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>💾</span>
            Save & Load
          </h3>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <button onClick={save} className="primary">
            <span>💾</span>
            Save to Browser
          </button>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={onExport}>
              <span>📤</span>
              Export
            </button>
            {downloadHref && (
              <a href={downloadHref} download="brickbuilder-scene.json" className="button">
                <span>⬇️</span>
                Download
              </a>
            )}
          </div>
          
          <label>
            <input type="file" accept="application/json" onChange={onImport} />
            <span className="button" style={{ width: "100%", justifyContent: "center" }}>
              <span>📥</span>
              Import JSON
            </span>
          </label>
          
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to clear all bricks?")) {
                clear();
              }
            }}
            style={{ background: "var(--danger)", borderColor: "var(--danger)", color: "white" }}
          >
            <span>🗑️</span>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}