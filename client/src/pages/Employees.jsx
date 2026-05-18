import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeService } from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus, Search, Edit3, Trash2, X, ChevronLeft, ChevronRight,
  Filter, Users, SortAsc, SortDesc, UserPlus
} from 'lucide-react';

/**
 * Employees Page - Full CRUD employee management with search, filter, pagination.
 */

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'QA'];
const ITEMS_PER_PAGE = 8;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: '', email: '', department: 'Development',
    skills: '', performanceScore: '', experience: ''
  };
  const [formData, setFormData] = useState(initialForm);

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

  // ===== Filter, Search, Sort =====
  const filtered = employees
    .filter(e => {
      const matchName = e.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter ? e.department === deptFilter : true;
      return matchName && matchDept;
    })
    .sort((a, b) => {
      let aVal = a[sortBy], bVal = b[sortBy];
      if (sortBy === 'name') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ===== Handlers =====
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData(initialForm);
    setEditMode(false);
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      skills: emp.skills.join(', '),
      performanceScore: emp.performanceScore,
      experience: emp.experience
    });
    setSelectedEmployee(emp);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      performanceScore: Number(formData.performanceScore),
      experience: Number(formData.experience)
    };

    try {
      if (editMode && selectedEmployee) {
        await employeeService.update(selectedEmployee._id, payload);
        toast.success('Employee updated successfully');
      } else {
        await employeeService.create(payload);
        toast.success('Employee added successfully');
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await employeeService.delete(id);
      toast.success('Employee deleted');
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#06d6a0';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '20px' }}>
        <h2 style={{ color: '#f1f1f7' }}>Loading Employees...</h2>
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: isMobile ? '48px' : '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f1f7', margin: 0 }}>Employees</h1>
          <p style={{ fontSize: '14px', color: '#8b8b9e', margin: '4px 0 0 0' }}>{employees.length} total employees</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAddModal}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            borderRadius: '12px', fontSize: '14px', fontWeight: 600,
            background: 'linear-gradient(135deg, #06d6a0, #3b82f6)', color: '#fff', border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Employee
        </motion.button>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8b8b9e' }} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%', padding: '10px 16px 10px 40px', borderRadius: '12px', fontSize: '14px',
              outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#f1f1f7', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Department Filter */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Filter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8b8b9e' }} />
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%', padding: '10px 32px 10px 40px', borderRadius: '12px', fontSize: '14px',
              outline: 'none', appearance: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7', boxSizing: 'border-box'
            }}
          >
            <option value="" style={{ background: '#12121a', color: '#f1f1f7' }}>All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#12121a', color: '#f1f1f7' }}>{d}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7'
            }}
          >
            <option value="createdAt" style={{ background: '#12121a', color: '#f1f1f7' }}>Date</option>
            <option value="performanceScore" style={{ background: '#12121a', color: '#f1f1f7' }}>Score</option>
            <option value="experience" style={{ background: '#12121a', color: '#f1f1f7' }}>Experience</option>
            <option value="name" style={{ background: '#12121a', color: '#f1f1f7' }}>Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)', color: '#8b8b9e', cursor: 'pointer'
            }}
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)'
      }}>
        {paginated.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 500, color: '#8b8b9e', whiteSpace: 'nowrap' }}>Employee</th>
                    <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 500, color: '#8b8b9e', whiteSpace: 'nowrap' }}>Department</th>
                    {!isMobile && <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 500, color: '#8b8b9e', whiteSpace: 'nowrap' }}>Skills</th>}
                    <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 500, color: '#8b8b9e', whiteSpace: 'nowrap' }}>Score</th>
                    {!isMobile && <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 500, color: '#8b8b9e', whiteSpace: 'nowrap' }}>Exp</th>}
                    <th style={{ textAlign: 'right', padding: '16px 20px', fontWeight: 500, color: '#8b8b9e', whiteSpace: 'nowrap' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((emp) => (
                    <tr key={emp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold',
                            background: `linear-gradient(135deg, ${getScoreColor(emp.performanceScore)}22, ${getScoreColor(emp.performanceScore)}44)`,
                            color: getScoreColor(emp.performanceScore)
                          }}>
                            {emp.name.charAt(0)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 500, color: '#f1f1f7', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</p>
                            <p style={{ fontSize: '12px', color: '#8b8b9e', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                          {emp.department}
                        </span>
                      </td>
                      {!isMobile && (
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {emp.skills.slice(0, 3).map(s => (
                              <span key={s} style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '12px', background: 'rgba(124,58,237,0.1)', color: '#a78bfa' }}>
                                {s}
                              </span>
                            ))}
                            {emp.skills.length > 3 && <span style={{ fontSize: '12px', color: '#8b8b9e' }}>+{emp.skills.length - 3}</span>}
                          </div>
                        </td>
                      )}
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ fontWeight: 'bold', color: getScoreColor(emp.performanceScore) }}>{emp.performanceScore}%</span>
                      </td>
                      {!isMobile && <td style={{ padding: '12px 20px', color: '#8b8b9e' }}>{emp.experience} yrs</td>}
                      <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => openEditModal(emp)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer' }}>
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => setDeleteConfirm(emp._id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '12px', color: '#8b8b9e', margin: 0 }}>
                  Page {currentPage} of {totalPages} · {filtered.length} results
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', color: '#f1f1f7', border: 'none', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.3 : 1 }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', color: '#f1f1f7', border: 'none', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages ? 0.3 : 1 }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: '#8b8b9e' }}>
            <Users size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>No employees found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)' }}>
          <div style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '24px', background: 'rgba(18,18,26,0.98)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f1f7', margin: 0 }}>
                <UserPlus size={18} style={{ color: '#06d6a0' }} />
                {editMode ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#8b8b9e', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#8b8b9e' }}>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Aman Verma" style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#8b8b9e' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="aman@gmail.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#8b8b9e' }}>Department</label>
                <select name="department" value={formData.department} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none', appearance: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7', boxSizing: 'border-box' }}>
                  {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#12121a', color: '#f1f1f7' }}>{d}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#8b8b9e' }}>Skills (comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="React, Node.js, MongoDB" style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#8b8b9e' }}>Performance Score (0-100)</label>
                  <input type="number" name="performanceScore" value={formData.performanceScore} onChange={handleChange} required min="0" max="100" placeholder="85" style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#8b8b9e' }}>Years of Experience</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" placeholder="3" style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f1f7', boxSizing: 'border-box' }} />
                </div>
              </div>

              <button type="submit" disabled={submitting} style={{ marginTop: '8px', width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #06d6a0, #3b82f6)', color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Saving...' : (editMode ? 'Update Employee' : 'Add Employee')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)' }}>
          <div style={{ width: '100%', maxWidth: '320px', borderRadius: '16px', padding: '24px', textAlign: 'center', background: 'rgba(18,18,26,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', background: 'rgba(239,68,68,0.1)' }}>
              <Trash2 size={24} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#f1f1f7' }}>Delete Employee?</h3>
            <p style={{ fontSize: '14px', color: '#8b8b9e', margin: '0 0 24px 0' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, background: 'rgba(255,255,255,0.05)', color: '#f1f1f7', border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
