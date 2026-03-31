"use client";

import { useState, useEffect } from "react";
import {
  Users, Shield, UserCheck, Award, Calendar, Mail, Briefcase, Pencil, Trash2
} from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/types";
import AttorneyModal from "./AttorneyModal";

const roleColors: Record<string, string> = {
  OWNER: "bg-[var(--gold-500)]/20 text-[var(--gold-400)] border-[var(--gold-500)]/30",
  ADMIN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  EDITOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  LEGAL_REVIEWER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  SEO_ANALYST: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const roleLabels: Record<string, string> = {
  OWNER: "Proprietar",
  ADMIN: "Administrator",
  EDITOR: "Editor",
  LEGAL_REVIEWER: "Reviewer Juridic",
  SEO_ANALYST: "Analist SEO",
};

export default function AttorneysPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));
    
    const q = query(collection(db, "users"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      
      await minLoadTime;
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: UserProfile) => {
    if (window.confirm(`Sunteți sigur că doriți să ștergeți profilul pentru "${user.name}"?\nAceastă acțiune nu șterge contul Firebase Auth (trebuie șters manual din consolă dacă este cazul).`)) {
      try {
        await deleteUserProfile(user.id);
      } catch (err) {
        console.error("Eroare la ștergerea profilului", err);
        alert("A apărut o eroare la ștergere.");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-[var(--navy-800)] rounded-xl w-64"></div>
        <div className="glass-card h-20 border-l-[var(--gold-500)]"></div>
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="glass-card h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Echipa</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            {users.length} membri • Gestionați echipa și competențele E-E-A-T
          </p>
        </div>
        <button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--gold-500)]/20 transition-all"
        >
          <Users className="w-4 h-4" />
          Membru Nou
        </button>
      </div>

      {/* E-E-A-T Notice */}
      <div className="glass-card p-4 border-l-2 border-l-[var(--gold-500)]">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[var(--gold-400)] mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white">E-E-A-T și Autoritate</h3>
            <p className="text-xs text-[var(--navy-400)] mt-1">
              Profilurile avocaților sunt semnale de încredere esențiale pentru Google.
              Completați bio-ul, credențialele și apartenența la barou pentru fiecare avocat
              care semnează sau revizuiește conținutul YMYL.
            </p>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`glass-card p-6 group hover:border-[var(--gold-500)]/20 transition-all animate-fade-in-up flex flex-col justify-between ${
              !user.isActive ? "opacity-60 grayscale-[30%]" : ""
            }`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                {/* Avatar */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--navy-700)] to-[var(--navy-800)] border border-[var(--glass-border)] flex items-center justify-center text-lg font-bold text-[var(--gold-400)] shrink-0">
                    {user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white text-base">
                        {user.name}
                      </h3>
                      <span className={`badge text-[10px] ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                      {user.isActive ? (
                        <span className="badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                          ACTIV
                        </span>
                      ) : (
                        <span className="badge bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                          INACTIV
                        </span>
                      )}
                    </div>

                    {user.bio && (
                      <p className="text-sm text-[var(--navy-400)] mt-2 line-clamp-2">{user.bio}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="p-1.5 rounded-md hover:bg-[var(--glass-hover)] text-[var(--navy-400)] hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user)}
                    className="p-1.5 rounded-md hover:bg-red-500/20 text-[var(--navy-400)] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {user.barMembership && (
                  <div className="flex items-center gap-2 text-xs text-[var(--navy-400)]">
                    <Award className="w-4 h-4 text-[var(--gold-400)] shrink-0" />
                    <span className="truncate">{user.barMembership}</span>
                  </div>
                )}
                {user.yearsExp ? (
                  <div className="flex items-center gap-2 text-xs text-[var(--navy-400)]">
                    <Calendar className="w-4 h-4 text-[var(--navy-500)] shrink-0" />
                    <span>{user.yearsExp} ani experiență</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2 text-xs text-[var(--navy-400)]">
                  <Mail className="w-4 h-4 text-[var(--navy-500)] shrink-0" />
                  <span className="truncate" title={user.email}>{user.email}</span>
                </div>
                {(user.practiceAreas?.length || 0) > 0 && (
                  <div className="flex items-center gap-2 text-xs text-[var(--navy-400)]">
                    <Briefcase className="w-4 h-4 text-[var(--navy-500)] shrink-0" />
                    <span>{user.practiceAreas.length} arii practică</span>
                  </div>
                )}
              </div>

              {(user.practiceAreas?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {user.practiceAreas.map((area) => (
                    <span
                      key={area}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--navy-800)] text-[var(--navy-400)] border border-[var(--glass-border)]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* E-E-A-T Completeness */}
            <div className="mt-4 pt-3 border-t border-[var(--glass-border)]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[var(--navy-500)]">Profil E-E-A-T</span>
                <span className="text-[var(--navy-400)]">
                  {[user.bio, user.barMembership, user.credentials, user.yearsExp, (user.practiceAreas?.length || 0) > 0].filter(Boolean).length}/5 completat
                </span>
              </div>
              <div className="h-1.5 bg-[var(--navy-800)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-400)] transition-all"
                  style={{
                    width: `${([user.bio, user.barMembership, user.credentials, user.yearsExp, (user.practiceAreas?.length || 0) > 0].filter(Boolean).length / 5) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Users className="w-10 h-10 text-[var(--navy-600)] mx-auto mb-3" />
          <p className="text-[var(--navy-400)]">Niciun membru in baza de date.</p>
        </div>
      )}

      {isModalOpen && (
        <AttorneyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => setIsModalOpen(false)}
          attorney={selectedUser}
        />
      )}
    </div>
  );
}
