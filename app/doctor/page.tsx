"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  UserRound, 
  LogOut, 
  ChevronRight, 
  Clock, 
  Plus,
  MoreVertical,
  Activity,
  UserCog,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";

// --- Types ---
type Staff = {
  id: number;
  name: string;
  role: string;
  status: "Active" | "On Break";
};

type QueueItem = {
  ticket: string;
  name: string;
  status: "In Progress" | "Waiting";
};

type Appointment = {
  id: number;
  patient: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Completed";
};

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "availability" | "queue" | "staff" | "appointments"
  >("overview");

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Modal States
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // --- Functional State ---
  const [queue, setQueue] = useState<QueueItem[]>([
    { ticket: "P-12", name: "Alice V.", status: "In Progress" },
    { ticket: "P-13", name: "Bob S.", status: "Waiting" },
    { ticket: "P-14", name: "Charlie D.", status: "Waiting" },
    { ticket: "P-15", name: "David L.", status: "Waiting" },
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, name: "Nurse Joy", role: "Head Nurse", status: "Active" },
    { id: 2, name: "Sarah Miller", role: "Receptionist", status: "On Break" },
    { id: 3, name: "Mark Wilson", role: "Lab Tech", status: "Active" },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 101, patient: "John Doe", date: "2026-05-10", time: "10:00 AM", status: "Confirmed" },
    { id: 102, patient: "Jane Smith", date: "2026-05-11", time: "02:00 PM", status: "Pending" },
    { id: 103, patient: "Mike Ross", date: "2026-05-07", time: "09:00 AM", status: "Completed" },
  ]);

  // --- Handlers ---
  const moveNext = () => {
    if (queue.length <= 1) {
      setQueue([]);
      return;
    }
    const updated = queue.slice(1);
    updated[0].status = "In Progress";
    setQueue(updated);
  };

  const toggleStaffStatus = (id: number) => {
    setStaff(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === "Active" ? "On Break" : "Active" } : s
    ));
  };

  const updateAppointmentStatus = (id: number) => {
    const statusOrder: Appointment["status"][] = ["Pending", "Confirmed", "Completed"];
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const currentIndex = statusOrder.indexOf(a.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...a, status: statusOrder[nextIndex] };
      }
      return a;
    }));
  };

  const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMember: Staff = {
      id: Date.now(),
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      status: "Active"
    };
    setStaff([...staff, newMember]);
    setShowStaffModal(false);
  };

  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAppt: Appointment = {
      id: Date.now(),
      patient: formData.get("patient") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      status: "Pending"
    };
    setAppointments([...appointments, newAppt]);
    setShowScheduleModal(false);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 text-blue-600 font-bold text-xl tracking-tight">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
              <Activity size={24} strokeWidth={3} />
            </div>
            HealthFirst
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "availability", label: "Schedule", icon: Calendar },
            { id: "queue", label: "Live Queue", icon: Clock },
            { id: "staff", label: "Team Management", icon: Users },
            { id: "appointments", label: "Patient Visits", icon: ClipboardList },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                ? "bg-blue-50 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dr. Smith's Dashboard</h1>
            <p className="text-slate-500 font-medium">Monitoring clinic operations for May 7, 2026</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-slate-100">
             <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
               <UserRound size={20} />
             </div>
             <div>
               <p className="text-xs font-black uppercase text-slate-400 leading-none">Status</p>
               <p className="text-sm font-bold text-green-600">On Duty</p>
             </div>
          </div>
        </header>

        <div className="max-w-6xl">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]">
                  <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <UserRound size={20} />
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Today's Patients</p>
                  <p className="text-4xl font-black text-slate-900">{appointments.length}</p>
                </div>
                <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]">
                  <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Clock size={20} />
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Waiting Queue</p>
                  <p className="text-4xl font-black text-orange-600">{queue.length}</p>
                </div>
                <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]">
                  <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Users size={20} />
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Active Staff</p>
                  <p className="text-4xl font-black text-green-600">{staff.filter(s => s.status === "Active").length}</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <h2 className="text-2xl font-bold mb-2">Current Patient</h2>
                   <p className="text-slate-400 font-medium">
                    {queue.length > 0 ? (
                      <>Serving <span className="text-white font-bold">{queue[0].name}</span> ({queue[0].ticket})</>
                    ) : (
                      "No patients currently in queue."
                    )}
                   </p>
                </div>
                <button 
                  onClick={moveNext}
                  disabled={queue.length === 0}
                  className="mt-6 md:mt-0 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 z-10"
                >
                  {queue.length > 1 ? "Next Patient" : "Clear Queue"} <ChevronRight size={18} />
                </button>
                <Activity className="absolute -right-10 -bottom-10 text-slate-800 h-64 w-64 opacity-20" />
              </div>
            </div>
          )}

          {/* AVAILABILITY TAB */}
          {activeTab === "availability" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Monthly Schedule</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowScheduleModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <Plus size={18} /> Add Schedule
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight className="rotate-180" /></button>
                    <span className="font-bold py-2 px-4">May 2026</span>
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight /></button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase mb-2">{d}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => {
                  const dateStr = `2026-05-${(i + 1).toString().padStart(2, '0')}`;
                  const apptCount = appointments.filter(a => a.date === dateStr).length;
                  return (
                    <button 
                      key={i} 
                      className={`h-24 rounded-2xl border p-2 transition-all flex flex-col items-start ${
                        apptCount > 0 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-sm font-bold">{i + 1}</span>
                      {apptCount > 0 && <span className="text-[10px] font-medium opacity-80 mt-1">{apptCount} appts</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUEUE TAB */}
          {activeTab === "queue" && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold">Live Patient Queue</h2>
                <span className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full text-xs font-black">
                  <Clock size={14} /> {queue.length} PATIENTS WAITING
                </span>
              </div>
              <div className="p-8 space-y-4">
                {queue.length > 0 ? (
                  queue.map((q, i) => (
                    <div key={q.ticket} className={`flex justify-between items-center p-6 rounded-2xl border transition-all ${
                      q.status === "In Progress" ? "bg-blue-50 border-blue-100 shadow-sm" : "bg-white border-slate-100"
                    }`}>
                      <div className="flex items-center gap-6">
                        <span className={`h-12 w-12 flex items-center justify-center rounded-xl font-black ${
                          q.status === "In Progress" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                        }`}>{q.ticket}</span>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{q.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{q.status}</p>
                        </div>
                      </div>
                      {q.status === "In Progress" && (
                        <button onClick={moveNext} className="bg-white text-blue-600 border border-blue-200 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">
                          Complete
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-slate-400">
                    <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Queue is empty!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAFF TAB */}
          {activeTab === "staff" && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-bold">Medical Team</h2>
                <button 
                  onClick={() => setShowStaffModal(true)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                >
                  <Plus size={18} /> Add Member
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Staff Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="pr-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staff.map((s) => (
                    <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <UserCog size={18} />
                          </div>
                          <span className="font-bold text-slate-800">{s.name}</span>
                        </div>
                      </td>
                      <td className="text-sm font-semibold text-slate-500">{s.role}</td>
                      <td>
                        <button 
                          onClick={() => toggleStaffStatus(s.id)}
                          className={`px-3 py-1 text-[10px] rounded-full font-black uppercase transition-all ${
                            s.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {s.status}
                        </button>
                      </td>
                      <td className="pr-8 text-right">
                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === "appointments" && (
            <div className="space-y-4 animate-in fade-in duration-300">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Upcoming Patient Visits</h2>
                  <div className="text-sm text-slate-500 font-bold">Total: {appointments.length}</div>
               </div>
               {appointments.map((a) => (
                 <div key={a.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
                   <div className="flex items-center gap-5">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                        a.status === 'Completed' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <ClipboardList size={24} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-800">{a.patient}</p>
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                          <span className="flex items-center gap-1"><Calendar size={12}/> {a.date}</span>
                          <span className="flex items-center gap-1"><Clock size={12}/> {a.time}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 self-end md:self-center">
                     <button 
                       onClick={() => updateAppointmentStatus(a.id)}
                       className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-80 active:scale-95 ${
                        a.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                        a.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                      }`}
                     >
                       {a.status}
                     </button>
                     <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all">
                       <MoreVertical size={20} />
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          )}

        </div>
      </main>

      {/* ADD STAFF MODAL */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Staff Member</h3>
              <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input name="name" required className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-blue-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                <input name="role" required className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-blue-600" />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Add Member</button>
            </form>
          </div>
        </div>
      )}

      {/* ADD SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Appointment</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Patient Name</label>
                <input name="patient" required className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-blue-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                  <input name="date" type="date" required className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-blue-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Time</label>
                  <input name="time" type="time" required className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:outline-blue-600" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Confirm Schedule</button>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT OVERLAY */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
              <LogOut size={40} />
            </div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">Signing Out</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Securely closing your session. Have a great rest of your day, Doctor!</p>
            <div className="mt-8 flex justify-center">
               <div className="w-24 h-1.5 bg-slate-100 relative overflow-hidden rounded-full">
                  <div className="absolute inset-y-0 left-0 bg-blue-600 w-1/2 animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}