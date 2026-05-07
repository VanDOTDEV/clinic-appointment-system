"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("patient"); 

  const router = useRouter();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("booking");

  const [bookingDept, setBookingDept] = useState<Department>("Primary Care");
  const [bookingDoctor, setBookingDoctor] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isTelehealth, setIsTelehealth] = useState(false);
  const [reminders, setReminders] = useState({ sms: true, email: true });
  const [bookingStatus, setBookingStatus] = useState("idle");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  type Department = "Primary Care" | "Pediatrics" | "Cardiology";

  type Appointment = {
    id: number;
    doctor: string;
    date: string;
    time: string;
    dept: Department;
    status: string;
    type: string;
  };

  const doctorsByDept: Record<Department, string[]> = {
    "Primary Care": ["Dr. Emily Chen", "Dr. Marcus Johnson", "Dr. Olivia Smith"],
    Pediatrics: ["Dr. David Lee", "Dr. Sarah Williams"],
    Cardiology: ["Dr. Sarah Jenkins", "Dr. Robert Patel", "Dr. Michael Chang"],
  };

  const [messages, setMessages] = useState([
    { sender: "support", text: "Hello! How can we help you today?" },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 101, doctor: "Dr. Emily Chen", date: "2026-05-10", time: "02:30 PM", dept: "Primary Care", status: "Confirmed", type: "Telehealth" },
    { id: 102, doctor: "Dr. Marcus Johnson", date: "2026-05-15", time: "09:00 AM", dept: "Primary Care", status: "Confirmed", type: "In-Person" }
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: "Nurse Joy", role: "Head Nurse", dept: "Pediatrics", status: "Active" },
    { id: 2, name: "Sarah Miller", role: "Receptionist", dept: "Front Desk", status: "On Break" },
    { id: 3, name: "Mark Wilson", role: "Lab Tech", dept: "Diagnostics", status: "Active" }
  ]);

  const [queue, setQueue] = useState([
    { ticket: "PC-012", name: "Alice V.", status: "In-Progress" },
    { ticket: "PC-013", name: "Bob S.", status: "Waiting" },
    { ticket: "PC-014", name: "Charlie D.", status: "Waiting" }
  ]);

  const availableSlots = [
    "08:30 AM", "09:00 AM", "10:15 AM", "11:00 AM", 
    "01:30 PM", "02:45 PM", "03:30 PM", "04:00 PM"
  ];

  const mockMedicalRecords = [
    { id: 1, date: "Oct 12, 2025", type: "Annual Physical", provider: "Dr. Emily Chen", notes: "Patient is in good health. Advised to maintain current diet and exercise routine." },
    { id: 2, date: "Jun 04, 2025", type: "Urgent Care", provider: "Dr. Marcus Johnson", notes: "Presented with mild strep throat. Prescribed 10-day course of Amoxicillin." },
  ];

  const mockLabResults = [
    { id: 1, date: "Oct 14, 2025", test: "Complete Blood Count (CBC)", status: "Normal", provider: "LabCorp", unread: true },
    { id: 2, date: "Oct 14, 2025", test: "Lipid Panel", status: "Attention", provider: "LabCorp", unread: false },
  ];

  const mockBilling = [
    { id: "INV-8832", date: "Oct 12, 2025", description: "Copay - Annual Physical", amount: "₱750.00", status: "Paid" },
    { id: "INV-8104", date: "Oct 14, 2025", description: "Lab Services - Lipid Panel", amount: "₱1,850.00", status: "Pending" },
  ];

  const faqs = [
    { q: "Do you accept walk-in patients?", a: "While we recommend booking an appointment to minimize your wait time, we do accept walk-in patients for non-life-threatening urgent care needs." },
    { q: "What should I bring to my first appointment?", a: "Please bring your photo ID, current insurance card, a list of current medications, and any relevant medical records from previous providers." },
    { q: "How can I get my prescription refilled?", a: "You can request a refill through your Patient Portal once logged in, or by asking your pharmacy to send us an electronic refill request." },
    { q: "Do you offer telemedicine or virtual visits?", a: "Yes! We offer secure video consultations for follow-ups, minor illnesses, and mental health check-ins. You can select this option when booking." }
  ];

  useEffect(() => {
    setBookingDoctor(doctorsByDept[bookingDept]?.[0] || "");
    setBookingTime("");
  }, [bookingDept]);

  const handleBookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    } else {
      setIsMobileMenuOpen(false);
      setActiveTab("booking");
    }
  };

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoggedIn(true);
    setIsAuthModalOpen(false);

    // 👇 redirect based on role
    if (userRole === "doctor") {
      router.push("/doctor");
    }
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBookingStatus("submitting");

    const newAppt = {
      id: Math.floor(Math.random() * 1000),
      doctor: bookingDoctor,
      date: bookingDate,
      time: bookingTime,
      dept: bookingDept,
      status: "Confirmed",
      type: isTelehealth ? "Telehealth" : "In-Person"
    };

    setTimeout(() => {
      setAppointments([...appointments, newAppt]);
      setBookingStatus("success");
    }, 1500);
  };

  const cancelAppointment = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const rescheduleAppointment = (id: number) => {
    const app = appointments.find(a => a.id === id);
    if (!app) return;

    setBookingDept(app.dept);
    setBookingDoctor(app.doctor);
    setIsTelehealth(app.type === "Telehealth");
    setActiveTab("booking");
    cancelAppointment(id);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: chatMessage }]);
    setChatMessage("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "support", text: "A support representative will get back to you shortly." }
      ]);
      setIsTyping(false);
    }, 1200);
  };

    const services = [
    {
      title: "Primary Care",
      description: "Comprehensive wellness exams, vaccinations, and chronic disease management.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: "Cardiology",
      description: "Advanced heart screenings, ECGs, and specialized care for cardiovascular health.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: "Pediatrics",
      description: "Dedicated healthcare for infants, children, and adolescents in a friendly environment.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Diagnostics & Lab",
      description: "On-site blood tests, X-rays, and imaging with rapid digital results.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (

    <div className="min-h-screen scroll-smooth bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 relative">
      
      
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">HealthFirst Portal</h2>
                <p className="text-sm text-slate-600 mt-1">Access your healthcare dashboard.</p>
              </div>
              <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
                <button onClick={() => setAuthMode("login")} className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${authMode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Sign In</button>
                <button onClick={() => setAuthMode("register")} className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${authMode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Register</button>
              </div>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">User Role</label>
                  <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none">
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor / Admin</option>
                  </select>
                </div>
                {authMode === "register" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500" placeholder="John Doe" />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                  <input type="password" required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500" placeholder="••••••••" />
                </div>
                <button type="submit" className="mt-2 w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700">
                  Continue to Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative ml-auto h-full w-4/5 max-w-sm bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-blue-900">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex flex-col gap-6 text-lg font-medium text-slate-700">
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
              <a href="#faqs" onClick={() => setIsMobileMenuOpen(false)}>FAQs</a>
              <hr className="border-slate-100" />
              {isLoggedIn ? (
                <>
                  <a href="#portal" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-600">My Dashboard</a>
                  <button onClick={() => {setIsLoggedIn(false); setIsMobileMenuOpen(false);}} className="text-left text-red-500">Logout</button>
                </>
              ) : (
                <button onClick={() => {setIsMobileMenuOpen(false); setIsAuthModalOpen(true);}} className="text-left text-blue-600">Log In / Register</button>
              )}
              <a href="#portal" onClick={handleBookClick} className="mt-4 rounded-full bg-blue-600 px-6 py-3 text-center font-bold text-white shadow-md shadow-blue-200">Book Appointment</a>
            </div>
          </div>
        </div>
      )}

      <div className="hidden bg-slate-900 px-6 py-2 text-sm text-slate-300 md:block md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Mon - Fri: 8:00 AM - 8:00 PM
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium text-white">
            <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white animate-pulse">Emergency</span>
            24/7 Hotline: (555) 911-0000
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-40 flex items-center justify-between bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-blue-900">HealthFirst</span>
        </div>
        <div className="hidden gap-8 font-medium text-slate-600 md:flex">
          <a href="#services" className="transition-colors hover:text-blue-600">Services</a>
          <a href="#faqs" className="transition-colors hover:text-blue-600">FAQs</a>
          <a href="#portal" className="transition-colors hover:text-blue-600">Portal</a>
        </div>
        
        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <div className="flex items-center gap-4 mr-2">
              <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {userRole === "doctor" ? "D" : "P"}
                </div>
                <span className="text-sm font-medium text-slate-600">Hi, {userRole === "doctor" ? "Dr. Chen" : "Patient"}</span>
              </div>
              <button onClick={() => setIsLoggedIn(false)} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">Logout</button>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Log In</button>
          )}
          <a href="#portal" onClick={handleBookClick} className="rounded-full bg-blue-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
            Book Appointment
          </a>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </nav>

      <main>
        
        <section className="relative overflow-hidden bg-white px-6 py-16 md:px-12 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-6 text-left">
              <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600">
                Award-winning Healthcare
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Expert Medical Care <br className="hidden sm:block" /> You Can Trust.
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-slate-600">
                Providing comprehensive healthcare services for patients of all ages. Experience compassionate care tailored to your unique needs using state-of-the-art facilities.
              </p>
              <div className="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                <a href="#portal" onClick={handleBookClick} className="flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
                  Schedule a Visit
                </a>
                <a href="#services" className="flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50">
                  Explore Services
                </a>
              </div>
            </div>
            <div className="relative h-[350px] w-full overflow-hidden rounded-3xl bg-slate-100 lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-blue-50 z-0"></div>
              <Image 
                src="/image.jpg" 
                alt="Healthcare"
                fill
                className="object-cover z-10 mix-blend-overlay"
                priority 
              />
            </div>
          </div>
        </section>
        <section id="portal" className="bg-blue-900 px-6 py-24 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-800 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-800 opacity-50 blur-3xl"></div>

          <div className="mx-auto max-w-7xl relative z-10">
            {!isLoggedIn ? (
              <div className="mx-auto max-w-3xl rounded-3xl bg-white p-12 text-center shadow-2xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path></svg>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-slate-900">Secure Patient Portal</h2>
                <p className="mx-auto mb-8 max-w-md text-slate-600">To protect your medical privacy, book appointments, and view lab results, please log in to your account.</p>
                <button onClick={() => setIsAuthModalOpen(true)} className="rounded-full bg-blue-600 px-8 py-3.5 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
                  Log In or Register to Access
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8 lg:flex-row animate-in fade-in zoom-in-95 duration-500">
                
                <div className="w-full lg:w-1/3 space-y-6">
                  <div className="rounded-3xl bg-white p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">{userRole === "doctor" ? "Doctor Admin" : "My Dashboard"}</h3>
                    
                    <div className="space-y-2">
                      {userRole === "patient" && (
                        <>
                          <button onClick={() => setActiveTab("booking")} className={`w-full text-left rounded-lg px-4 py-3 font-medium transition-colors flex justify-between items-center ${activeTab === "booking" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-900"}`}>Book Appointment</button>
                          <button onClick={() => setActiveTab("records")} className={`w-full text-left rounded-lg px-4 py-3 font-medium transition-colors flex justify-between items-center ${activeTab === "records" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-900"}`}>Medical Records</button>
                        </>
                      )}
                      {userRole === "doctor" && (
                        <>
                          <button onClick={() => setActiveTab("availability")} className={`w-full text-left rounded-lg px-4 py-3 font-medium transition-colors ${activeTab === "availability" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-900"}`}>Availability Calendar</button>
                          <button onClick={() => setActiveTab("queue")} className={`w-full text-left rounded-lg px-4 py-3 font-medium transition-colors ${activeTab === "queue" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-900"}`}>Queue Management</button>
                          <button onClick={() => setActiveTab("staff")} className={`w-full text-left rounded-lg px-4 py-3 font-medium transition-colors ${activeTab === "staff" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-900"}`}>Staff Management</button>
                        </>
                      )}
                      <button onClick={() => setActiveTab("appointments")} className={`w-full text-left rounded-lg px-4 py-3 font-medium transition-colors ${activeTab === "appointments" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-900"}`}>All Appointments</button>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-2/3 rounded-3xl bg-white p-8 shadow-xl md:p-10 relative overflow-hidden min-h-[600px]">
                  
                  {activeTab === "booking" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {bookingStatus === "success" && (
                        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                          <div className="h-20 w-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>
                          </div>
                          <h2 className="text-3xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h2>
                          <button onClick={() => setActiveTab("appointments")} className="text-blue-600 font-bold underline">View My Appointments</button>
                        </div>
                      )}

                      <div className="mb-8 border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Schedule a New Visit</h2>
                      </div>

                      <form onSubmit={handleBookingSubmit} className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button type="button" onClick={() => setIsTelehealth(false)} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${!isTelehealth ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}>In-Person Visit</button>
                            <button type="button" onClick={() => setIsTelehealth(true)} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${isTelehealth ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}>Virtual / Telehealth</button>
                          </div>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-slate-700">Department</label>
                              <select
                                value={bookingDept}
                                onChange={(e) => setBookingDept(e.target.value as Department)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 focus:border-blue-500 transition-all shadow-sm"
                              >
                              </select>
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-slate-700">Provider</label>
                              <select value={bookingDoctor} onChange={(e) => setBookingDoctor(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 focus:border-blue-500 transition-all shadow-sm">
                                {doctorsByDept[bookingDept].map(doc => <option key={doc} value={doc}>{doc}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Select Date</label>
                            <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3.5" required />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Available Slots</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {availableSlots.map(slot => (
                                <button key={slot} type="button" onClick={() => setBookingTime(slot)} className={`py-2 rounded-lg text-sm font-medium border transition-all ${bookingTime === slot ? "bg-blue-600 text-white border-blue-600 shadow-md" : "border-slate-200 hover:border-blue-400 text-slate-600"}`}>{slot}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button type="submit" disabled={bookingStatus === "submitting" || !bookingDate || !bookingTime} className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50">
                          {bookingStatus === "submitting" ? "Processing..." : "Confirm Appointment"}
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "appointments" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Appointments</h2>
                      <div className="space-y-4">
                        {appointments.length > 0 ? appointments.map(appt => (
                          <div key={appt.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div>
                                <h4 className="font-bold text-lg">{appt.doctor}</h4>
                                <p className="text-sm text-slate-500">{appt.dept} • {appt.type}</p>
                                <div className="mt-2 flex items-center gap-4 text-blue-600 font-semibold">
                                  <span className="flex items-center gap-1"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{appt.date}</span>
                                  <span className="flex items-center gap-1"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{appt.time}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 items-start">
                                <button onClick={() => rescheduleAppointment(appt.id)} className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Reschedule</button>
                                <button onClick={() => cancelAppointment(appt.id)} className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Cancel</button>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12 text-slate-500">No upcoming appointments found.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "queue" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Live Queue Status</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-600 text-white rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                          <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-2">Now Serving</p>
                          <h3 className="text-5xl font-black">{queue[0].ticket}</h3>
                          <p className="mt-2 font-bold text-xl">{queue[0].name}</p>
                        </div>
                        <div className="space-y-4">
                          <p className="font-bold text-slate-500 uppercase text-xs">Next in Queue</p>
                          {queue.slice(1).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-bold text-slate-700">{item.ticket}</span>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-xs bg-slate-200 px-2 py-1 rounded font-bold">{item.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "staff" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Staff Management</h2>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="pb-4">Name</th>
                            <th className="pb-4">Role</th>
                            <th className="pb-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {staff.map(member => (
                            <tr key={member.id} className="group">
                              <td className="py-4 font-bold text-slate-700">{member.name}</td>
                              <td className="py-4 text-slate-600">{member.role}</td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${member.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                  {member.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "availability" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Doctor Availability</h2>
                      <div className="grid grid-cols-7 gap-2">
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                          <div key={i} className="text-center font-bold text-slate-400 text-xs mb-2">{d}</div>
                        ))}
                        {Array.from({length: 31}).map((_, i) => (
                          <button key={i} className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all ${i % 7 === 0 ? "bg-blue-600 text-white shadow-md" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                        <h4 className="text-sm font-bold text-blue-800 mb-2">Manage Selected Date</h4>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-white border border-blue-200 py-2 rounded-lg text-xs font-bold text-blue-700">Add Slot</button>
                          <button className="flex-1 bg-white border border-blue-200 py-2 rounded-lg text-xs font-bold text-blue-700">Block Day</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "records" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Medical History</h2>
                      <div className="space-y-6">
                        {mockMedicalRecords.map(record => (
                          <div key={record.id} className="border-l-4 border-blue-500 pl-6 py-2">
                            <span className="text-sm font-bold text-slate-400 uppercase">{record.date}</span>
                            <h4 className="text-xl font-bold text-slate-900 mt-1">{record.type}</h4>
                            <p className="text-sm font-medium text-blue-600 mb-2">{record.provider}</p>
                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl italic">{record.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </section>

        <section id="services" className="bg-slate-50 px-6 py-24 md:px-12">
  <div className="mx-auto max-w-7xl text-center">
    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600">Our Expertise</h2>
    <h3 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Specialized Healthcare Services</h3>
    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
      We offer a wide range of medical services to ensure you and your family receive the best care possible under one roof.
    </p>

    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service, index) => (
        <div 
          key={index} 
          className="group relative rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100"
        >
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            {service.icon}
          </div>
          <h4 className="mb-3 text-xl font-bold text-slate-900">{service.title}</h4>
          <p className="text-sm leading-relaxed text-slate-500">
            {service.description}
          </p>
          <div className="mt-6">
            <a href="#portal" className="text-sm font-bold text-blue-600 hover:text-blue-700">
              Learn more →
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        <section id="faqs" className="bg-white px-6 py-24 md:px-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                  <button onClick={() => toggleFaq(i)} className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-50">
                    <span className="font-bold text-slate-900">{faq.q}</span>
                    <svg className={`h-5 w-5 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openFaq === i && <div className="bg-slate-50 px-6 pb-6 text-slate-600">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 px-6 py-12 text-slate-400 md:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="max-w-sm">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg></div>
                <span className="text-xl font-bold text-white">HealthFirst</span>
              </div>
              <p className="text-sm leading-relaxed">Providing world-class medical services since 1998. Your health is our first priority.</p>
            </div>
            <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
              <div>
                <h4 className="mb-6 font-bold text-white uppercase tracking-wider text-xs">Quick Links</h4>
                <ul className="space-y-4 text-sm"><li className="hover:text-blue-400 transition-colors"><a href="#">About Us</a></li><li className="hover:text-blue-400 transition-colors"><a href="#">Contact</a></li><li className="hover:text-blue-400 transition-colors"><a href="#">Careers</a></li></ul>
              </div>
              <div>
                <h4 className="mb-6 font-bold text-white uppercase tracking-wider text-xs">Legal</h4>
                <ul className="space-y-4 text-sm"><li className="hover:text-blue-400 transition-colors"><a href="#">Privacy Policy</a></li><li className="hover:text-blue-400 transition-colors"><a href="#">Terms of Use</a></li><li className="hover:text-blue-400 transition-colors"><a href="#">HIPAA Compliance</a></li></ul>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm">© 2026 HealthFirst Medical Group. All rights reserved.</div>
        </div>
      </footer>

              <div className="fixed bottom-6 right-6 z-50">
                {!isChatOpen ? (
                  <button onClick={() => setIsChatOpen(true)} className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 transition-all hover:scale-110">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </button>
                ) : (
                  <div className="w-80 h-96 rounded-2xl bg-white shadow-2xl flex flex-col border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-10">
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                      <span className="font-bold flex items-center gap-2"><span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span> Live Support</span>
                      <button onClick={() => setIsChatOpen(false)} className="hover:text-blue-200"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-sm shadow-sm max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-100 text-slate-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl text-sm text-slate-500 shadow-sm">
                Typing...
              </div>
            </div>
          )}
        </div>
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                placeholder="Type message..."
                className="flex-1 text-sm outline-none"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="text-blue-600 font-bold text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}