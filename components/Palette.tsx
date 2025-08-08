"use client";
import React, { useState } from "react";
import { 
  BRICK_LIBRARY, BrickSize, COLORS, ColorKey, BrickCategory,
  CATEGORY_NAMES, getAllCategories, getPiecesByCategory 
} from "@/lib/lego/bricks";
import { useBuilderStore } from "@/store/useBuilderStore";
import { 
  saveToLocalStorage, downloadBuildFile, handleFileUpload, 
  saveNamedBuild, getSavedBuilds, deleteSavedBuild, LEGOBuildFile 
} from "@/lib/io/serialize";

export default function Palette() {
  const { 
    selectedSize, setSelectedSize, selectedColor, setSelectedColor, 
    rotation, rotateCW, baseplate, setBaseplate, bricks, clear, save 
  } = useBuilderStore();

  const [downloadHref, setDownloadHref] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BrickCategory>("basic");
  const [showInfo, setShowInfo] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  const [savedBuilds, setSavedBuilds] = useState<LEGOBuildFile[]>([]);

  // Load saved builds on component mount
  React.useEffect(() => {
    setSavedBuilds(getSavedBuilds());
  }, []);

  const handleSaveBuild = () => {
    if (!buildName.trim()) return;
    
    const scene = { bricks, baseplate };
    saveNamedBuild(scene, buildName.trim(), buildDescription.trim() || undefined);
    setSavedBuilds(getSavedBuilds());
    setBuildName("");
    setBuildDescription("");
    setShowSaveDialog(false);
  };

  const handleLoadBuild = (buildFile: LEGOBuildFile) => {
    const { loadScene } = useBuilderStore.getState();
    loadScene(buildFile.scene);
    saveToLocalStorage(buildFile.scene);
    setShowLoadDialog(false);
  };

  const handleDeleteBuild = (name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteSavedBuild(name);
      setSavedBuilds(getSavedBuilds());
    }
  };

  const handleDownloadBuild = () => {
    const scene = { bricks, baseplate };
    const name = buildName.trim() || `build_${Date.now()}`;
    downloadBuildFile(scene, name, buildDescription.trim() || undefined);
  };

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const buildFile = await handleFileUpload(file);
      if (buildFile) {
        handleLoadBuild(buildFile);
      } else {
        alert("Failed to load build file. Please check the file format.");
      }
    } catch (error) {
      alert("Error loading file: " + error);
    }
  };

  const categoryPieces = getPiecesByCategory(selectedCategory);
  const brickCount = bricks.length;
  const totalStuds = bricks.reduce((sum, b) => sum + (b.size.w * b.size.l), 0);

  return (
    <div className="fade-in">
      {/* Info Card - Plates vs Bricks */}
      {showInfo && (
        <div className="card" style={{ background: "var(--panel3)", marginBottom: 16 }}>
          <div className="card-header">
            <h3 className="card-title">
              <span>📚</span>
              LEGO Basics
            </h3>
            <button 
              className="icon-button" 
              onClick={() => setShowInfo(false)}
              style={{ width: 24, height: 24, padding: 0 }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>
            <div style={{ marginBottom: 12 }}>
              <strong>Bricks vs Plates:</strong>
              <ul style={{ margin: "4px 0", paddingLeft: 20 }}>
                <li><strong>1 Brick</strong> = 3 Plates tall (9.6mm)</li>
                <li><strong>1 Plate</strong> = 1/3 Brick tall (3.2mm)</li>
                <li><strong>1 Stud</strong> = 8mm spacing</li>
              </ul>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Tiles:</strong> Plates without studs for smooth surfaces
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Technic Pieces:</strong> Beams with cross-holes for axles and pins. Used for mechanical builds with moving parts.
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Wheels & Hubs:</strong> Hubs connect to axles, wheels have rubber tires for rolling
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Airplane Parts:</strong> Wings with airfoil profiles, engines, cockpits, and fuselage sections
            </div>
            <div>
              <strong>Part Numbers:</strong> Official LEGO element IDs shown in tooltips
            </div>
          </div>
        </div>
      )}

      {/* Brick Selection */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>🧱</span>
            Brick Type
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button 
              className="icon-button tooltip" 
              onClick={() => setShowInfo(!showInfo)}
              data-tooltip="Help"
              style={{ fontSize: 12 }}
            >
              ?
            </button>
            <button 
              className="icon-button tooltip" 
              onClick={rotateCW}
              data-tooltip="Rotate (R)"
              style={{ background: rotation > 0 ? "var(--accent)" : undefined }}
            >
              {rotation}°
            </button>
          </div>
        </div>
        
        {/* Category Dropdown */}
        <select 
          value={selectedCategory} 
          onChange={e => setSelectedCategory(e.target.value as BrickCategory)}
          style={{ marginBottom: 12 }}
        >
          {getAllCategories().map(cat => (
            <option key={cat} value={cat}>
              {CATEGORY_NAMES[cat]} ({getPiecesByCategory(cat).length})
            </option>
          ))}
        </select>

        {/* Pieces Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: selectedCategory === "plates" ? "repeat(3, 1fr)" : "repeat(2, 1fr)", 
          gap: 6,
          maxHeight: 300,
          overflowY: "auto",
          padding: "4px 0"
        }}>
          {categoryPieces.map(piece => {
            const isSelected = selectedSize === piece;
            return (
              <button
                key={`${piece.category}-${piece.name}`}
                onClick={() => setSelectedSize(piece)}
                className="tooltip"
                data-tooltip={piece.partNum ? `Part #${piece.partNum}` : piece.name}
                style={{
                  background: isSelected ? "var(--accent)" : "var(--panel)",
                  borderColor: isSelected ? "var(--accent)" : "var(--border)",
                  padding: "8px",
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2
                }}
              >
                <div style={{ fontWeight: 600 }}>{piece.w}×{piece.l}</div>
                <div style={{ 
                  fontSize: 10, 
                  color: isSelected ? "white" : "var(--muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {piece.name.replace(/^\d+×\d+\s+/, '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>🎨</span>
            Color ({Object.keys(COLORS).length} colors)
          </h3>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(5, 1fr)", 
          gap: 6,
          maxHeight: 180,
          overflowY: "auto"
        }}>
          {(Object.keys(COLORS) as ColorKey[]).map(k => (
            <button 
              key={k} 
              onClick={() => setSelectedColor(k)}
              className={`color-button tooltip ${selectedColor === k ? 'selected' : ''}`}
              style={{ 
                background: COLORS[k],
                height: 32,
                borderRadius: 6
              }}
              data-tooltip={k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1')}
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
          <option value="small">Small (16×16 studs)</option>
          <option value="medium">Medium (32×32 studs)</option>
          <option value="large">Large (48×48 studs)</option>
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
            <div className="stat-label">Pieces</div>
          </div>
          <div className="stat">
            <div className="stat-value">{totalStuds}</div>
            <div className="stat-label">Total Studs</div>
          </div>
        </div>
      </div>

      {/* Save & Load */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>💾</span>
            Save & Load
          </h3>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {/* Quick Save */}
          <button onClick={save} className="primary">
            <span>💾</span>
            Quick Save to Browser
          </button>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => setShowSaveDialog(true)}>
              <span>🏷️</span>
              Save As...
            </button>
            <button onClick={() => setShowLoadDialog(true)}>
              <span>📁</span>
              Load Build
            </button>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={handleDownloadBuild}>
              <span>⬇️</span>
              Download JSON
            </button>
            <label>
              <input type="file" accept=".json" onChange={onFileUpload} style={{ display: 'none' }} />
              <span className="button" style={{ width: "100%", justifyContent: "center" }}>
                <span>📁</span>
                Upload File
              </span>
            </label>
          </div>
          
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

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="card" style={{ background: "var(--panel3)", border: "2px solid var(--accent)" }}>
          <div className="card-header">
            <h3 className="card-title">Save Build</h3>
            <button 
              className="icon-button" 
              onClick={() => setShowSaveDialog(false)}
              style={{ width: 24, height: 24, padding: 0 }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--textDim)" }}>Build Name *</label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="My Awesome Build"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--textDim)" }}>Description</label>
              <textarea
                value={buildDescription}
                onChange={(e) => setBuildDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button onClick={handleSaveBuild} disabled={!buildName.trim()}>
                <span>💾</span>
                Save
              </button>
              <button onClick={() => setShowSaveDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="card" style={{ background: "var(--panel3)", border: "2px solid var(--accent)" }}>
          <div className="card-header">
            <h3 className="card-title">Load Build</h3>
            <button 
              className="icon-button" 
              onClick={() => setShowLoadDialog(false)}
              style={{ width: 24, height: 24, padding: 0 }}
            >
              ✕
            </button>
          </div>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {savedBuilds.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--textDim)", padding: 16 }}>
                No saved builds found
              </p>
            ) : (
              savedBuilds.map((build) => (
                <div key={build.name} style={{ 
                  padding: 12, 
                  border: "1px solid var(--border)", 
                  borderRadius: 6,
                  marginBottom: 8,
                  background: "var(--panel)"
                }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-start",
                    marginBottom: 8
                  }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14 }}>{build.name}</h4>
                      <div style={{ fontSize: 11, color: "var(--textDim)" }}>
                        {build.metadata.pieceCount} pieces • {build.metadata.studCount} studs
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button 
                        onClick={() => handleLoadBuild(build)}
                        className="small"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => handleDeleteBuild(build.name)}
                        className="small"
                        style={{ background: "var(--danger)", borderColor: "var(--danger)", color: "white" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {build.description && (
                    <p style={{ 
                      margin: 0, 
                      fontSize: 12, 
                      color: "var(--textDim)",
                      fontStyle: "italic"
                    }}>
                      {build.description}
                    </p>
                  )}
                  <div style={{ 
                    fontSize: 10, 
                    color: "var(--textDim)", 
                    marginTop: 4
                  }}>
                    Created: {new Date(build.created).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}