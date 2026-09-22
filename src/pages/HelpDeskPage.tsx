import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  HelpCircle,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { HelpDeskEmoji } from '../components/LiveEmoji';
import { StudentProfile, SupportTicket } from '../types';

interface HelpDeskPageProps {
  student: StudentProfile;
}

const FAQS = [
  {
    q: 'How does AdaptiveLearn determine my mastery percentage?',
    a: 'Deterministic mastery combines 4 components: Assessment score (50%), Practice accuracy (20%), Recent trend (15%), and Practice consistency (15%). It never relies on ungrounded AI guessing.',
  },
  {
    q: 'Why is my Retention score different from my Mastery score?',
    a: 'Mastery reflects how well you perform when actively studying. Retention models memory decay over 14 days without practice using spaced repetition equations. You can have high mastery but decayed retention, which triggers the 2-week revision alert.',
  },
  {
    q: 'Why are advanced topics like Graphs locked on my learning path?',
    a: 'AdaptiveLearn enforces a prerequisite threshold (minimum 60% mastery). Because Graphs depend mathematically on Trees and Arrays, you must first achieve 60% in foundational topics.',
  },
  {
    q: 'How do I earn leaderboard points?',
    a: 'You receive 100 points for every topic where mastery reaches 60%+, plus 2 points for every practice question solved correctly.',
  },
];

export const HelpDeskPage: React.FC<HelpDeskPageProps> = ({ student }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  // Ticket Submission Form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Technical' | 'Academic' | 'Content' | 'Feedback'>('Academic');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'AL-849201',
      studentId: student.id,
      subject: 'Explanation on Tree Inorder Traversal edge cases',
      category: 'Academic',
      priority: 'Medium',
      description: 'Requesting additional worked code examples for skewed binary tree inorder traversal in C++.',
      status: 'In Progress',
      createdAt: '2026-09-18T10:30:00Z',
      updatedAt: '2026-09-18T14:15:00Z',
    },
    {
      id: 'AL-731920',
      studentId: student.id,
      subject: 'Clarification on 14-day spaced revision test',
      category: 'Content',
      priority: 'Low',
      description: 'Understood the concept clearly. Verified retention boost.',
      status: 'Resolved',
      createdAt: '2026-09-15T09:00:00Z',
      updatedAt: '2026-09-15T11:00:00Z',
    },
  ]);

  const handleAskHelpAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiAnswering(true);
    setAiAnswer(null);

    // Provide intelligent contextual response
    setTimeout(() => {
      const q = aiQuery.toLowerCase();
      if (q.includes('retention') || q.includes('decay') || q.includes('14')) {
        setAiAnswer(
          'Our 14-day Spaced Retention Engine tracks forgetting curves. When 14 days pass without practicing a topic, retention drops below 65%, generating a 2-week revision alert on your dashboard.'
        );
      } else if (q.includes('prerequisite') || q.includes('locked')) {
        setAiAnswer(
          'Topics remain locked until prerequisite topics reach 60% mastery. For example, Graph Traversal requires Trees (≥60%) and Arrays (≥60%).'
        );
      } else if (q.includes('exam') || q.includes('schedule') || q.includes('b.tech')) {
        setAiAnswer(
          'AdaptiveLearn calibrates your daily study plan according to your semester syllabus and target exam date. You can also view your custom schedule under the "What Should I Study Today?" button.'
        );
      } else {
        setAiAnswer(
          `AdaptiveLearn provides automated guidance for "${aiQuery}". We have logged your inquiry with the academic support team.`
        );
      }
      setIsAiAnswering(false);
    }, 600);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const newId = `AL-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: newId,
        studentId: student.id,
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTickets([newTicket, ...tickets]);
      setSubject('');
      setDescription('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div id="help-desk-page-container" className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <LifeBuoy className="w-4 h-4" />
          <span>Student Support & Academic Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-3">
          <HelpDeskEmoji />
          <span>Help Desk & Ticket Center</span>
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl">
          Get instant AI assistance on your curriculum, view frequently asked questions, or open a tracked ticket (`AL-xxxxxx`) with your teaching assistants.
        </p>
      </div>

      {/* AI Help Assistant Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
          <MessageSquare className="w-4 h-4" />
          <span>Instant AI Help Assistant</span>
        </div>

        <form onSubmit={handleAskHelpAI} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask about curriculum prerequisites, revision tests, scoring..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isAiAnswering || !aiQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>

        {isAiAnswering && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 animate-pulse">
            Analyzing academic knowledge base...
          </div>
        )}

        {aiAnswer && (
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed animate-in fade-in">
            <strong className="text-cyan-300 block mb-1">Help Desk Response:</strong>
            {aiAnswer}
          </div>
        )}
      </div>

      {/* FAQs Accordion */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-950/70 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Center: Create Ticket & My Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Ticket Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Submit a Support Ticket</span>
          </h2>

          <form onSubmit={handleCreateTicket} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Difficulty understanding BST balance condition"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                >
                  <option value="Academic">Academic / Concept</option>
                  <option value="Technical">Technical Issue</option>
                  <option value="Content">Curriculum Content</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              {isSubmitting ? 'Creating Ticket...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* My Tickets List */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-display">My Tickets</h2>
            <span className="text-xs text-slate-400">{tickets.length} Registered</span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{t.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : t.status === 'In Progress'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{t.category}</span>
                </div>

                <h4 className="font-semibold text-xs text-slate-200">{t.subject}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
