import React, { useEffect, useState, useMemo } from 'react';
import { adminService, AdminStudent } from '../../services/adminService';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    adminService.getStudents()
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = useMemo(() => {
    if (!debouncedSearchTerm) return students;
    const lower = debouncedSearchTerm.toLowerCase();
    return students.filter(s => 
      s.displayName.toLowerCase().includes(lower) || 
      s.email.toLowerCase().includes(lower)
    );
  }, [students, debouncedSearchTerm]);

  const toggleStatus = async (uid: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await adminService.updateStudentStatus(uid, newStatus);
      setStudents(students.map(s => s.uid === uid ? { ...s, status: newStatus } : s));
    } catch (e) {
      console.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Student Management</h2>
          <p className="text-gray-400 mt-2">Manage student accounts and view activity.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search students by name or email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-gray-400 py-8 text-center">Loading students...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800 text-gray-400 text-sm">
                <tr>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredStudents.map(student => (
                  <tr key={student.uid} className="group">
                    <td className="py-4 text-white font-medium">{student.displayName}</td>
                    <td className="py-4 text-gray-400">{student.email}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {student.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => toggleStatus(student.uid, student.status)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentsPage;
