import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Brain, Code2, Sparkles, Clapperboard, Rocket, MessageCircle, Library, TimerReset, CheckCircle2, Flame, Trophy, Target, Plus, BookOpen, CalendarDays, Zap, Save, Trash2 } from 'lucide-react';
import './styles.css';

const AREAS = [
  { id: 'programacao', name: 'Programação', icon: Code2, color: 'blue', desc: 'Lógica, Luau, Python e web.' },
  { id: 'ia', name: 'Inteligência Artificial', icon: Sparkles, color: 'purple', desc: 'Prompts, automação, imagens e vídeos.' },
  { id: 'edicao', name: 'Edição de Vídeo', icon: Clapperboard, color: 'red', desc: 'CapCut, legenda, ritmo e retenção.' },
  { id: 'empreendedorismo', name: 'Empreendedorismo', icon: Rocket, color: 'orange', desc: 'Projetos, dinheiro, produto e vendas.' },
  { id: 'comunicacao', name: 'Comunicação', icon: MessageCircle, color: 'green', desc: 'Fala, escrita, postura e confiança.' },
  { id: 'raciocinio', name: 'Raciocínio Lógico', icon: Brain, color: 'cyan', desc: 'Desafios, foco e pensamento rápido.' }
];

const DEFAULT_MISSIONS = [
  { id: crypto.randomUUID(), title: 'Estudar 20 minutos com foco total', area: 'Organização', xp: 20, done: false },
  { id: crypto.randomUUID(), title: 'Criar 1 legenda profissional no CapCut', area: 'Edição de Vídeo', xp: 25, done: false },
  { id: crypto.randomUUID(), title: 'Resolver 1 desafio de lógica', area: 'Raciocínio Lógico', xp: 20, done: false },
  { id: crypto.randomUUID(), title: 'Salvar 1 prompt útil de IA', area: 'Inteligência Artificial', xp: 15, done: false }
];

const DEFAULT_PROJECTS = [
  { id: crypto.randomUUID(), title: 'Canal de Shorts de Ciência', area: 'Edição + IA', progress: 35, desc: 'Roteiro, imagens, narração, legenda e postagem.' },
  { id: crypto.randomUUID(), title: 'Jogo simples no Roblox', area: 'Luau', progress: 10, desc: 'Aprender lógica e criar um protótipo jogável.' },
  { id: crypto.randomUUID(), title: 'Site pessoal profissional', area: 'Web', progress: 20, desc: 'Portfólio para mostrar projetos no futuro.' }
];

const lessons = {
  programacao: ['Lógica: variável, condição e repetição', 'Luau Roblox: scripts simples', 'Python: automação no celular', 'HTML/CSS/JS: criar sites'],
  ia: ['Prompt profissional', 'Prompt para imagem realista', 'Automação de estudos', 'Organizar pesquisa com IA'],
  edicao: ['Legenda profissional', 'Animação de foto parada', 'Ritmo e corte', 'Retenção para Shorts'],
  empreendedorismo: ['Ideia simples que resolve problema', 'Como vender sem parecer chato', 'Oferta, preço e prova', 'Projeto pequeno para ganhar experiência'],
  comunicacao: ['Falar claro', 'Escrever melhor', 'Argumentar sem travar', 'Treino de confiança'],
  raciocinio: ['Desafio diário', 'Pensar em etapas', 'Resolver problema sem desespero', 'Memória e foco']
};

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function App() {
  const [missions, setMissions] = useState(() => load('at_missions', DEFAULT_MISSIONS));
  const [projects, setProjects] = useState(() => load('at_projects', DEFAULT_PROJECTS));
  const [notes, setNotes] = useState(() => load('at_notes', []));
  const [active, setActive] = useState('dashboard');
  const [focusMinutes, setFocusMinutes] = useState(20);
  const [seconds, setSeconds] = useState(20 * 60);
  const [running, setRunning] = useState(false);
  const [newMission, setNewMission] = useState('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => save('at_missions', missions), [missions]);
  useEffect(() => save('at_projects', projects), [projects]);
  useEffect(() => save('at_notes', notes), [notes]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
      const m = { id: crypto.randomUUID(), title: `Sessão foco de ${focusMinutes} min concluída`, area: 'Organização', xp: focusMinutes, done: true };
      setMissions(prev => [m, ...prev]);
    }
  }, [seconds, running, focusMinutes]);

  const xp = missions.filter(m => m.done).reduce((sum, m) => sum + Number(m.xp || 0), 0);
  const level = Math.floor(xp / 100) + 1;
  const weekGoal = missions.length ? Math.round((missions.filter(m => m.done).length / missions.length) * 100) : 0;
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const today = useMemo(() => new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }), []);

  function toggleMission(id) {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m));
  }

  function addMission() {
    if (!newMission.trim()) return;
    setMissions(prev => [{ id: crypto.randomUUID(), title: newMission.trim(), area: 'Personalizada', xp: 15, done: false }, ...prev]);
    setNewMission('');
  }

  function addNote() {
    if (!noteText.trim()) return;
    setNotes(prev => [{ id: crypto.randomUUID(), title: 'Nota rápida', area: 'Estudo', content: noteText.trim(), created: new Date().toLocaleString('pt-BR') }, ...prev]);
    setNoteText('');
  }

  function resetTimer(min) {
    setFocusMinutes(min);
    setSeconds(min * 60);
    setRunning(false);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="logo"><Zap size={24}/></div><div><b>Academia Thiago</b><span>Central profissional</span></div></div>
        <nav>
          {[
            ['dashboard', 'Dashboard', Target], ['missoes', 'Missões', Trophy], ['areas', 'Áreas de estudo', BookOpen], ['projetos', 'Projetos', Rocket], ['biblioteca', 'Biblioteca', Library], ['foco', 'Modo foco', TimerReset]
          ].map(([id, label, Icon]) => <button key={id} onClick={() => setActive(id)} className={active === id ? 'active' : ''}><Icon size={18}/>{label}</button>)}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><p>{today}</p><h1>{active === 'dashboard' ? 'Seu quartel-general de evolução' : active.charAt(0).toUpperCase() + active.slice(1)}</h1></div>
          <div className="profile"><Flame size={18}/><span>Nível {level}</span><b>{xp} XP</b></div>
        </header>

        {active === 'dashboard' && <section className="grid dashboard">
          <div className="hero card">
            <span className="badge">Plano online</span>
            <h2>Estude como profissional, usando só o celular.</h2>
            <p>Missões curtas, projetos reais e progresso salvo automaticamente no seu navegador.</p>
            <div className="heroActions"><button onClick={() => setActive('missoes')}>Começar missão</button><button className="ghost" onClick={() => setActive('foco')}>Abrir modo foco</button></div>
          </div>
          <Stat title="XP total" value={xp} icon={Trophy}/>
          <Stat title="Nível" value={level} icon={Flame}/>
          <Stat title="Missões feitas" value={`${missions.filter(m => m.done).length}/${missions.length}`} icon={CheckCircle2}/>
          <div className="card wide"><h3>Meta da semana</h3><div className="progress"><span style={{ width: `${weekGoal}%` }} /></div><p>{weekGoal}% concluído. O objetivo é estudar um pouco todo dia.</p></div>
          <div className="card wide"><h3>Próximas missões</h3>{missions.slice(0,4).map(m => <Mission key={m.id} m={m} onToggle={toggleMission}/>)}</div>
        </section>}

        {active === 'missoes' && <section className="content card">
          <h2>Missões diárias</h2><p>Marca como feito. Cada missão dá XP.</p>
          <div className="addLine"><input value={newMission} onChange={e=>setNewMission(e.target.value)} placeholder="Ex: estudar Luau por 20 minutos"/><button onClick={addMission}><Plus size={18}/>Adicionar</button></div>
          <div className="list">{missions.map(m => <Mission key={m.id} m={m} onToggle={toggleMission}/>)}</div>
        </section>}

        {active === 'areas' && <section className="areaGrid">
          {AREAS.map(area => {
            const Icon = area.icon;
            return <div key={area.id} className={`card area ${area.color}`}><Icon size={28}/><h3>{area.name}</h3><p>{area.desc}</p><ul>{lessons[area.id].map(l => <li key={l}>{l}</li>)}</ul></div>
          })}
        </section>}

        {active === 'projetos' && <section className="content card">
          <h2>Projetos reais</h2><p>Aprender sem projeto vira só teoria. Aqui você acompanha o que está construindo.</p>
          <div className="projectList">{projects.map(p => <div className="project" key={p.id}><div><b>{p.title}</b><span>{p.area}</span><p>{p.desc}</p></div><div className="progress"><span style={{ width: `${p.progress}%` }} /></div><small>{p.progress}%</small></div>)}</div>
        </section>}

        {active === 'biblioteca' && <section className="content card">
          <h2>Biblioteca e notas</h2><p>Salve ideias, prompts, links e aulas importantes.</p>
          <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Escreve aqui uma nota, prompt, ideia de vídeo ou resumo da aula..." />
          <button onClick={addNote}><Save size={18}/>Salvar nota</button>
          <div className="notes">{notes.map(n => <article key={n.id}><b>{n.title}</b><small>{n.created}</small><p>{n.content}</p></article>)}</div>
        </section>}

        {active === 'foco' && <section className="focus card">
          <TimerReset size={44}/><h2>Modo foco</h2><p>Sem teoria longa. Escolhe o tempo e começa.</p>
          <div className="timer">{minutes}:{secs}</div>
          <div className="timerButtons"><button onClick={() => setRunning(!running)}>{running ? 'Pausar' : 'Iniciar'}</button><button className="ghost" onClick={() => resetTimer(20)}>20 min</button><button className="ghost" onClick={() => resetTimer(30)}>30 min</button><button className="ghost" onClick={() => resetTimer(45)}>45 min</button></div>
        </section>}
      </main>
    </div>
  );
}

function Stat({ title, value, icon: Icon }) { return <div className="card stat"><Icon size={24}/><span>{title}</span><b>{value}</b></div> }
function Mission({ m, onToggle }) { return <div className={`mission ${m.done ? 'done' : ''}`} onClick={() => onToggle(m.id)}><CheckCircle2 size={20}/><div><b>{m.title}</b><span>{m.area} • {m.xp} XP</span></div></div> }

createRoot(document.getElementById('root')).render(<App />);
