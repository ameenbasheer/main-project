import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUploadCloud,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiLoader,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../services/api';

// Read a File into a base64 data URL the backend can forward to Gemini.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.readAsDataURL(file);
  });
}

const SEVERITY_STYLES = {
  none: 'bg-[#DCEEDD] text-[#2D5A3D]',
  mild: 'bg-[#FFF1DA] text-[#A56A1A]',
  moderate: 'bg-[#FFE0CC] text-[#A04F1C]',
  severe: 'bg-[#FFE3EC] text-[#A23368]',
};

export default function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const { diseaseResult, setDiseaseResult, clearDiseaseResult } = useApp();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      clearDiseaseResult();
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setError(null);
    try {
      const image = await fileToDataUrl(selectedFile);
      const result = await aiApi.diagnose({ image, mimeType: selectedFile.type });
      setDiseaseResult(result);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    clearDiseaseResult();
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const healthy = diseaseResult?.healthy;
  const confidence =
    diseaseResult?.confidence != null ? Math.round(diseaseResult.confidence) : null;
  const severityClass =
    SEVERITY_STYLES[diseaseResult?.severity] || SEVERITY_STYLES.moderate;

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
          <div
            className="rounded-3xl border border-light-border overflow-hidden h-80 lg:h-96 flex flex-col items-center justify-center bg-gradient-to-br from-accent/5 to-primary/5 cursor-pointer relative"
            onClick={() => !analyzing && document.getElementById('plant-upload').click()}
          >
            {preview ? (
              <img src={preview} alt="Plant" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-5">
                <FiUploadCloud size={48} className="text-accent/40 mx-auto mb-4" />
                <p className="text-light-muted text-sm">Click to upload plant photo</p>
              </div>
            )}

            {analyzing && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white">
                <FiLoader size={32} className="animate-spin" />
                <p className="text-sm font-medium">Analyzing leaf…</p>
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
              disabled={analyzing}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-accent text-white font-semibold text-sm hover:shadow-[0_10px_28px_rgba(22,163,74,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <FiLoader size={16} className="animate-spin" /> Analyzing…
                </>
              ) : (
                'Analyze Plant'
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700 text-xs">
              <FiAlertCircle className="mt-0.5 shrink-0" size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: Title & Results */}
        <div className="lg:col-span-1">
          <h1 className="text-3xl md:text-4xl font-light text-light-text mb-1">Disease</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-5">Detection</h2>

          {diseaseResult ? (
            <div className="rounded-3xl border border-light-border bg-white p-5 space-y-4">
              <div className="flex items-center gap-3">
                {healthy ? (
                  <FiCheckCircle className="text-accent" size={20} />
                ) : (
                  <FiAlertCircle className="text-amber-500" size={20} />
                )}
                <div className="min-w-0">
                  <p className="text-light-text font-semibold truncate">
                    {diseaseResult.disease || (healthy ? 'Healthy' : 'Unknown')}
                  </p>
                  <p className="text-light-muted text-xs truncate">{diseaseResult.plant} Plant</p>
                </div>
                {confidence != null && (
                  <span className="ml-auto text-accent font-bold whitespace-nowrap">
                    {confidence}%
                  </span>
                )}
              </div>

              {diseaseResult.severity && (
                <span
                  className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${severityClass}`}
                >
                  {diseaseResult.severity === 'none'
                    ? 'No disease'
                    : `${diseaseResult.severity} severity`}
                </span>
              )}

              {Array.isArray(diseaseResult.treatment) && diseaseResult.treatment.length > 0 && (
                <>
                  <hr className="border-light-border" />
                  <div>
                    <h4 className="text-light-text text-sm font-semibold mb-3">
                      {healthy ? 'Care tips' : 'Treatment'}
                    </h4>
                    <ul className="space-y-2">
                      {diseaseResult.treatment.map((t, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-light-text text-xs"
                        >
                          <FiCheckCircle className="text-accent mt-0.5 shrink-0" size={14} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {diseaseResult.note && (
                <p className="text-light-muted text-xs italic border-t border-light-border pt-3">
                  {diseaseResult.note}
                </p>
              )}

              <button
                onClick={reset}
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
