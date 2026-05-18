import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeService, aiService } from '../services/api';
import toast from 'react-hot-toast';
import {
  BrainCircuit, Sparkles, TrendingUp, BookOpen, Award,
  MessageSquare, Lightbulb, ChevronDown, Loader2, Users
} from 'lucide-react';

/**
 * AI Insights Page - AI-powered employee analysis and recommendations.
 */
const AIInsights = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getAll();
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedId) {
      toast.error('Please select an employee');
      return;
    }

    setGenerating(true);
    setRecommendation(null);

    try {
      const res = await aiService.getRecommendation(selectedId);
      setRecommendation(res.data);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const selectedEmployee = employees.find(e => e._id === selectedId);

  // Card configs for recommendation display
  const getCards = (rec) => [
    {
      icon: Award,
      title: 'Promotion Recommendation',
      content: rec.promotionRecommendation,
      color: '#06d6a0',
      bg: 'rgba(6,214,160,0.08)'
    },
    {
      icon: BookOpen,
      title: 'Training Suggestions',
      content: Array.isArray(rec.trainingSuggestions) ? rec.trainingSuggestions : [],
      isList: true,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)'
    },
    {
      icon: TrendingUp,
      title: 'Employee Ranking',
      content: rec.employeeRanking,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)'
    },
    {
      icon: MessageSquare,
      title: 'Performance Feedback',
      content: rec.performanceFeedback,
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.08)'
    },
    {
      icon: Lightbulb,
      title: 'Missing Skill Suggestions',
      content: Array.isArray(rec.missingSkillSuggestions) ? rec.missingSkillSuggestions : [],
      isList: true,
      color: '#ec4899',
      bg: 'rgba(236,72,153,0.08)'
    }
  ];

  const isMobile = window.innerWidth < 768;

  if (loading) {
    return (
      <div style={{ paddingTop: '20px' }}>
        <h2 style={{ color: '#f1f1f7' }}>Loading AI Insights...</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: isMobile ? '48px' : '0' }}
    >
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f1f7', margin: 0 }}>
          <BrainCircuit size={24} style={{ color: '#7c3aed' }} />
          AI Insights
        </h1>
        <p style={{ fontSize: '14px', color: '#8b8b9e', margin: '4px 0 0 0' }}>
          Generate AI-powered performance analysis and recommendations
        </p>
      </div>

      {/* Selection Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f1f7' }}>
          <Sparkles size={14} style={{ color: '#f59e0b' }} />
          Select Employee for AI Analysis
        </h3>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
          {/* Employee Select */}
          <div style={{ position: 'relative', flex: 1 }}>
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setRecommendation(null); }}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f1f7'
              }}
            >
              <option value="" style={{ background: '#12121a', color: '#f1f1f7' }}>-- Choose an employee --</option>
              {employees.map(e => (
                <option key={e._id} value={e._id} style={{ background: '#12121a', color: '#f1f1f7' }}>
                  {e.name} — {e.department} ({e.performanceScore}%)
                </option>
              ))}
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8b8b9e' }} />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedId}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: (generating || !selectedId) ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: '#fff',
              border: 'none',
              opacity: (generating || !selectedId) ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {generating ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Analyzing...
              </>
            ) : (
              <>
                <BrainCircuit size={16} />
                Generate Recommendation
              </>
            )}
          </button>
        </div>

        {/* Selected Employee Preview */}
        {selectedEmployee && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)'
          }}>
            <div style={{ flex: '1 1 120px' }}>
              <p style={{ fontSize: '12px', color: '#8b8b9e', margin: '0 0 2px 0' }}>Name</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#f1f1f7', margin: 0 }}>{selectedEmployee.name}</p>
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <p style={{ fontSize: '12px', color: '#8b8b9e', margin: '0 0 2px 0' }}>Department</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#3b82f6', margin: 0 }}>{selectedEmployee.department}</p>
            </div>
            <div style={{ flex: '1 1 80px' }}>
              <p style={{ fontSize: '12px', color: '#8b8b9e', margin: '0 0 2px 0' }}>Score</p>
              <p style={{
                fontSize: '14px', fontWeight: 'bold', margin: 0,
                color: selectedEmployee.performanceScore >= 80 ? '#06d6a0' : selectedEmployee.performanceScore >= 50 ? '#f59e0b' : '#ef4444'
              }}>
                {selectedEmployee.performanceScore}%
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* AI Results */}
      {recommendation && !generating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f1f7' }}>
            <Sparkles size={18} style={{ color: '#f59e0b' }} />
            AI Recommendation Results
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
            gap: '16px'
          }}>
            {getCards(recommendation).map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: card.bg,
                  border: `1px solid ${card.color}22`,
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <card.icon size={18} style={{ color: card.color }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: card.color }}>{card.title}</h4>
                </div>
                {card.isList ? (
                  <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                    {(card.content || []).map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#f1f1f7', marginBottom: '8px' }}>
                        <span style={{ color: card.color }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#f1f1f7', margin: 0 }}>{card.content}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!recommendation && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: '#8b8b9e' }}>
          <Users size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Waiting for analysis...</p>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default AIInsights;
