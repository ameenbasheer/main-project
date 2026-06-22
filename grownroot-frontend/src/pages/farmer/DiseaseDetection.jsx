import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUploadCloud, FiAlertCircle, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

export default function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { diseaseResult, setDiseaseResult, clearDiseaseResult } = useApp();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      clearDiseaseResult();
    }
  };

  const handleAnalyze = () => {
    // Static demo result — will be replaced with API call
    setDiseaseResult({
      disease: 'Early Blight',
      confidence: 87.06,
      plant: 'Tomato',
      treatment: [
        'Remove affected leaves immediately',
        'Apply copper-based fungicide',
        'Ensure proper spacing for air circulation',
        'Avoid overhead watering',
      ],
    });
  };

  return (
    <div className="relative">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-light-muted hover:text-accent text-sm mb-5 no-underline transition-colors relative z-10"
      >
        <FiArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        {/* Left: Steps */}
        <div className="lg:col-span-1">
          <div className="space-y-5">
            {[
              { num: '01', text: 'Upload your plant photo for analysis' },
              { num: '02', text: 'AI scans & identifies diseases' },
              { num: '03', text: 'Get results with treatment recommendations' },
            ].map((step, i) => (
              <div key={i} className="relative pl-5">
                <div className="absolute left-0 top-0 w-0.5 h-full bg-accent/20" />
                <div className="absolute left-[-4px] top-0 w-2.5 h-2.5 rounded-full bg-accent" />
                <p className="text-accent text-3xl font-bold mb-2">{step.num}</p>
                <p className="text-light-text text-sm font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Upload area */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-light-border overflow-hidden h-80 lg:h-96 flex flex-col items-center justify-center bg-gradient-to-br from-accent/5 to-primary/5 cursor-pointer relative"
            onClick={() => document.getElementById('plant-upload').click()}
          >
            {preview ? (
              <img src={preview} alt="Plant" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-5">
                <FiUploadCloud size={48} className="text-accent/40 mx-auto mb-4" />
                <p className="text-light-muted text-sm">Click to upload plant photo</p>
              </div>
            )}
            <input
              id="plant-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {selectedFile && !diseaseResult && (
            <button
              onClick={handleAnalyze}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-accent text-white font-semibold text-sm hover:shadow-[0_10px_28px_rgba(22,163,74,0.4)] transition-all"
            >
              Analyze Plant
            </button>
          )}
        </div>

        {/* Right: Title & Results */}
        <div className="lg:col-span-1">
          <h1 className="text-3xl md:text-4xl font-light text-light-text mb-1">Disease</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-5">Detection</h2>

          {diseaseResult ? (
            <div className="rounded-3xl border border-light-border bg-white p-5 space-y-4">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-amber-500" size={20} />
                <div>
                  <p className="text-light-text font-semibold">{diseaseResult.disease}</p>
                  <p className="text-light-muted text-xs">{diseaseResult.plant} Plant</p>
                </div>
                <span className="ml-auto text-accent font-bold">
                  {diseaseResult.confidence}%
                </span>
              </div>

              <hr className="border-light-border" />

              <div>
                <h4 className="text-light-text text-sm font-semibold mb-3">Treatment</h4>
                <ul className="space-y-2">
                  {diseaseResult.treatment.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-light-text text-xs">
                      <FiCheckCircle className="text-accent mt-0.5 shrink-0" size={14} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => { clearDiseaseResult(); setSelectedFile(null); setPreview(null); }}
                className="w-full py-2 rounded-full border border-accent/40 text-accent text-sm font-semibold hover:bg-accent hover:text-white transition"
              >
                Scan Another Plant
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-light-border h-52 bg-gradient-to-br from-accent/5 to-primary/5 flex items-center justify-center">
              <span className="text-5xl">🔬</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
