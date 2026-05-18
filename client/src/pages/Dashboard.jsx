import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { employeeService } from '../services/api';
import { Users, TrendingUp, Award, Building2, Star, ArrowUpRight } from 'lucide-react';

/**
 * Dashboard Page - Analytics overview with charts and stats cards.
 */
const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getAll();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===== Computed Analytics =====
  const totalEmployees = employees.length;
  const avgPerformance = totalEmployees > 0
    ? (employees.reduce((sum, e) => sum + e.performanceScore, 0) / totalEmployees).toFixed(1)
    : 0;
  const topPerformers = employees.filter(e => e.performanceScore >= 80).length;

  // Department stats
  const deptMap = {};
  employees.forEach(e => {
    if (!deptMap[e.department]) deptMap[e.department] = { count: 0, totalScore: 0 };
    deptMap[e.department].count++;
    deptMap[e.department].totalScore += e.performanceScore;
  });
  const deptData = Object.entries(deptMap).map(([name, data]) => ({
    name,
    employees: data.count,
    avgScore: Math.round(data.totalScore / data.count)
  }));

  // Pie chart for departments
  const PIE_COLORS = ['#06d6a0', '#3b82f6', '#7c3aed', '#ec4899', '#f59e0b', '#ef4444'];

  // Top 10 employees by performance
  const rankingData = [...employees]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 10)
    .map(e => ({ name: e.name.split(' ')[0], score: e.performanceScore }));

  // Skill distribution
  const skillMap = {};
  employees.forEach(e => {
    e.skills.forEach(s => {
      skillMap[s] = (skillMap[s] || 0) + 1;
    });
  });
  const skillData = Object.entries(skillMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Recent employees
  const recentEmployees = [...employees].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Stat cards config
  const stats = [
    { label: 'Total Employees', value: totalEmployees, icon: Users, color: '#06d6a0', bg: 'rgba(6,214,160,0.1)' },
    { label: 'Avg Performance', value: `${avgPerformance}%`, icon: TrendingUp, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Top Performers', value: topPerformers, icon: Award, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
    { label: 'Departments', value: Object.keys(deptMap).length, icon: Building2, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '20px' }}>
        <h2 style={{ color: '#f1f1f7' }}>Loading Dashboard...</h2>
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: isMobile ? '48px' : '0' }}
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f1f7', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#8b8b9e', margin: '4px 0 0 0' }}>AI-powered employee performance overview</p>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div variants={item} style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`,
        gap: '16px'
      }}>
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              cursor: 'default'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: stat.bg
              }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <ArrowUpRight size={14} style={{ color: stat.color }} />
            </div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f1f7', margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: '12px', color: '#8b8b9e', margin: '4px 0 0 0' }}>{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {/* Employee Ranking Bar Chart */}
        <motion.div variants={item} style={{
          padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f1f7', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={14} style={{ color: '#f59e0b' }} />
            Top Employee Rankings
          </h3>
          {rankingData.length > 0 ? (
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer>
                <BarChart data={rankingData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#8b8b9e', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8b8b9e', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f1f7' }} />
                  <Bar dataKey="score" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06d6a0" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8b9e', fontSize: '14px' }}>
              No employees yet. Add some to see rankings.
            </div>
          )}
        </motion.div>

        {/* Department Distribution Pie */}
        <motion.div variants={item} style={{
          padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f1f7', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={14} style={{ color: '#ec4899' }} />
            Department Distribution
          </h3>
          {deptData.length > 0 ? (
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="employees" nameKey="name">
                    {deptData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f1f7' }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#8b8b9e' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8b9e', fontSize: '14px' }}>
              No department data available.
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {/* Skill Distribution */}
        <motion.div variants={item} style={{
          padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f1f7', margin: '0 0 16px 0' }}>
            Skill Distribution
          </h3>
          {skillData.length > 0 ? (
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer>
                <LineChart data={skillData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#8b8b9e', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8b8b9e', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f1f7' }} />
                  <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4, fill: '#7c3aed' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8b9e', fontSize: '14px' }}>
              No skill data available.
            </div>
          )}
        </motion.div>

        {/* Recent Employees */}
        <motion.div variants={item} style={{
          padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f1f7', margin: '0 0 16px 0' }}>
            Recent Employees
          </h3>
          {recentEmployees.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentEmployees.map((emp, idx) => (
                <div key={emp._id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${PIE_COLORS[idx % PIE_COLORS.length]}22, ${PIE_COLORS[idx % PIE_COLORS.length]}44)`,
                    color: PIE_COLORS[idx % PIE_COLORS.length]
                  }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#f1f1f7', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</p>
                    <p style={{ fontSize: '12px', color: '#8b8b9e', margin: 0 }}>{emp.department}</p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '14px', fontWeight: 'bold', margin: 0,
                      color: emp.performanceScore >= 80 ? '#06d6a0' : emp.performanceScore >= 50 ? '#f59e0b' : '#ef4444'
                    }}>
                      {emp.performanceScore}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8b9e', fontSize: '14px' }}>
              No employees added yet.
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
