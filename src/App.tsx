import { useState, useEffect } from 'react';
import { CheckCircle, PlayCircle, Download, Calculator, Lock, LayoutDashboard, ChevronRight, Award, Trophy, Check } from 'lucide-react';

// Data mock for our 5 Projects
const PROJECTS = [
  { id: 1, name: "Galinheiro Funcional", time: "2-3 dias", cost: "R$80-180" },
  { id: 2, name: "Estufa Túnel", time: "1-2 dias", cost: "R$120-220" },
  { id: 3, name: "Viveiro de Mudas", time: "1-2 dias", cost: "R$60-150" },
  { id: 4, name: "Composteira 3 Estágios", time: "½ dia", cost: "R$0-120" },
  { id: 5, name: "Secador Solar", time: "1-2 dias", cost: "R$50-130" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [progressData, setProgressData] = useState<Record<string, boolean[]>>({
    '1': [false, false, false, false, false],
    '2': [false, false, false, false, false],
    '3': [false, false, false, false, false],
    '4': [false, false, false, false, false],
    '5': [false, false, false, false, false],
  });

  const totalTasks = 25;
  const completedTasks = Object.values(progressData).flat().filter(Boolean).length;
  const globalProgress = Math.round((completedTasks / totalTasks) * 100);

  const handleToggleChecklist = (projectId: string, index: number) => {
    setProgressData(prev => {
      const newArray = [...prev[projectId]];
      newArray[index] = !newArray[index];
      return { ...prev, [projectId]: newArray };
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem('rural_progress');
    if(saved) setProgressData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('rural_progress', JSON.stringify(progressData));
  }, [progressData]);
  
  return (
    <div className="min-h-screen flex bg-[#0a0f0a] text-zinc-100 font-dmsans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-1 border-r border-white/5 flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-sora font-bold text-brand">5 Projetos Rurais</h1>
          <p className="text-xs text-zinc-400 mt-1">Área de Membros Premium</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Visão Geral" />
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Aulas & Projetos</p>
          </div>
          {PROJECTS.map(p => (
            <NavItem key={p.id} active={activeTab === `proj-${p.id}`} onClick={() => setActiveTab(`proj-${p.id}`)} icon={<PlayCircle size={20} />} label={p.name} />
          ))}
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ferramentas extras</p>
          </div>
          <NavItem active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} icon={<Calculator size={20} />} label="Calculadora de Custo" />
          <NavItem active={activeTab === 'downloads'} onClick={() => setActiveTab('downloads')} icon={<Download size={20} />} label="Baixar Plantas (PDF)" />
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Conquistas</p>
          </div>
          <NavItem active={activeTab === 'certificate'} onClick={() => setActiveTab('certificate')} icon={<Award size={20} />} label="Certificado" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
         {/* Top Header */}
         <header className="h-16 border-b border-white/5 bg-surface-1/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8">
            <div className="flex items-center text-sm text-zinc-400">
              <span className="font-semibold text-zinc-200 hidden sm:block">Progresso Global:</span>
              <div className="ml-4 w-32 sm:w-48 h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5 relative">
                 <div className="h-full bg-gradient-to-r from-brand-dark to-brand transition-all duration-500" style={{ width: `${globalProgress}%` }} />
                 {globalProgress === 100 && <span className="absolute inset-0 bg-white/20 animate-pulse"></span>}
              </div>
              <span className={`ml-3 font-medium transition-colors ${globalProgress === 100 ? 'text-brand drop-shadow-[0_0_10px_rgba(139,195,74,0.8)]' : 'text-zinc-300'}`}>{globalProgress}%</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-xs font-bold border border-[#FFD700]/20 flex items-center gap-1">
                 ★ PREMIUM
              </span>
              <div className="w-9 h-9 rounded-full bg-surface-3 flex items-center justify-center border border-white/10 text-sm">👤</div>
            </div>
         </header>

         {/* Content Area */}
         <div className="flex-1 overflow-auto p-4 sm:p-8">
            <div className="max-w-5xl mx-auto pb-20">
               {activeTab === 'dashboard' && <DashboardView onNavigate={(id: number) => setActiveTab(`proj-${id}`)} getProjProgress={(id: number) => {
                  const arr = progressData[id.toString()];
                  return Math.round((arr.filter(Boolean).length / arr.length) * 100);
               }} />}
               {activeTab === 'calculator' && <CalculatorView />}
               {activeTab === 'downloads' && <DownloadsView />}
               {activeTab === 'certificate' && <CertificateView progress={globalProgress} />}
               {activeTab.startsWith('proj-') && <ProjectDetailView 
                  id={activeTab.replace('proj-', '')} 
                  progress={progressData[activeTab.replace('proj-', '')]} 
                  onToggle={(idx: number) => handleToggleChecklist(activeTab.replace('proj-', ''), idx)} 
               />}
            </div>
         </div>
         
         {/* Mobile Nav */}
         <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-1 border-t border-white/5 flex items-center justify-around z-50">
             <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-16 h-full ${activeTab === 'dashboard' ? 'text-brand' : 'text-zinc-500'}`}>
                 <LayoutDashboard size={20} />
                 <span className="text-[10px] mt-1 font-medium">Início</span>
             </button>
             <button onClick={() => setActiveTab('proj-1')} className={`flex flex-col items-center justify-center w-16 h-full ${activeTab.startsWith('proj-') ? 'text-brand' : 'text-zinc-500'}`}>
                 <PlayCircle size={20} />
                 <span className="text-[10px] mt-1 font-medium">Aulas</span>
             </button>
             <button onClick={() => setActiveTab('calculator')} className={`flex flex-col items-center justify-center w-16 h-full ${activeTab === 'calculator' ? 'text-brand' : 'text-zinc-500'}`}>
                 <Calculator size={20} />
                 <span className="text-[10px] mt-1 font-medium">Custos</span>
             </button>
         </div>
      </main>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? 'bg-brand/10 text-brand' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardView({ onNavigate, getProjProgress }: { onNavigate: (id: number) => void, getProjProgress: (id: number) => number }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="inline-block px-3 py-1 bg-brand/10 text-brand rounded-full text-xs font-semibold mb-4 border border-brand/20">
         SEU CANTEIRO DE OBRAS
      </div>
      <h2 className="text-3xl md:text-4xl font-sora font-bold mb-3 tracking-tight">Bem-vindo, Construtor! 🏗️</h2>
      <p className="text-zinc-400 mb-10 text-lg max-w-2xl">Escolha um projeto abaixo para começar as aulas. Seu progresso é salvo automaticamente em cada etapa da construção.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((proj) => {
          const progress = getProjProgress(proj.id);
          const isDone = progress === 100;
          return (
          <div key={proj.id} onClick={() => onNavigate(proj.id)} className={`glass-panel p-6 cursor-pointer hover:border-brand/40 transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(139,195,74,0.05)] hover:-translate-y-1 relative overflow-hidden ${isDone ? 'border-brand/30 bg-brand/5' : ''}`}>
            {isDone && <div className="absolute top-0 right-0 w-16 h-16 bg-brand/20 rounded-bl-full translate-x-8 -translate-y-8 flex items-end justify-start pb-4 pl-4 text-brand"><Award size={16}/></div>}
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className={`w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-300 shadow-inner ${isDone ? 'bg-brand/20' : 'bg-surface-2 group-hover:bg-brand/10'}`}>
                {proj.id === 1 ? '🐔' : proj.id === 2 ? '🌱' : proj.id === 3 ? '🌿' : proj.id === 4 ? '♻️' : '☀️'}
              </div>
              <div className={`text-xs font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDone ? 'bg-brand/10 text-brand' : 'bg-surface-3 text-zinc-400'}`}>
                <CheckCircle size={14} /> {progress}%
              </div>
            </div>
            <h3 className="text-xl font-bold font-sora mb-2">{proj.name}</h3>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mb-5">
               <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>{proj.time}</span>
               <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>Custo extra baixo</span>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
               <span className="text-brand text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                  Assistir Aula <ChevronRight size={16} className="ml-1" />
               </span>
               <PlayCircle size={20} className="text-zinc-600 group-hover:text-brand transition-colors" />
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

function ProjectDetailView({ id, progress, onToggle }: { id: string, progress: boolean[], onToggle: (idx: number) => void }) {
  const project = PROJECTS.find(p => p.id.toString() === id);
  if (!project) return <div>Projeto não encontrado</div>;

  const currentPercent = Math.round((progress.filter(Boolean).length / progress.length) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3 text-brand">
            <span className="text-xs font-bold uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full border border-brand/20">Módulo 0{project.id}</span>
         </div>
         {currentPercent === 100 && (
            <span className="flex items-center gap-2 text-sm font-bold text-brand bg-brand/10 px-4 py-1.5 rounded-full border border-brand/30 animate-pulse">
               <Trophy size={16} /> MÓDULO CONCLUÍDO
            </span>
         )}
      </div>
      <h2 className="text-3xl md:text-4xl font-sora font-bold mb-8 tracking-tight">{project.name}</h2>
      
      {/* Video Player Placeholder - Makes it feel like an expensive course */}
      <div className="aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center mb-10 relative overflow-hidden group w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 transition-opacity"></div>
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1592424001807-f39b6fc921c3?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
         
         <button className="relative z-20 w-24 h-24 rounded-full bg-brand/90 text-black flex items-center justify-center hover:scale-105 hover:bg-brand transition-all duration-300 shadow-[0_0_40px_rgba(139,195,74,0.4)] group-hover:shadow-[0_0_60px_rgba(139,195,74,0.6)]">
            <PlayCircle size={48} className="translate-x-1" />
         </button>
         
         <div className="absolute bottom-8 left-8 z-20">
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Novo</span>
               <span className="text-zinc-300 text-sm font-medium">12 min de aula</span>
            </div>
            <h3 className="text-2xl font-sora font-bold text-white shadow-black drop-shadow-lg">Passo a Passo da Construção</h3>
         </div>
         
         {/* Fake player controls */}
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
             <div className="h-full bg-brand w-1/3 relative">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="col-span-2 space-y-8">
             <div className="glass-panel p-8">
                <h3 className="text-xl font-bold font-sora mb-6 flex items-center gap-2"><CheckCircle className="text-brand" size={24} /> Seu Checklist de Obra</h3>
                <div className="bg-surface-1 rounded-xl p-1 mb-6 border border-white/5 flex gap-1">
                    <button className="flex-1 py-2 text-sm font-medium rounded-lg bg-surface-3 text-white">Materiais e Passos</button>
                </div>
                <ul className="space-y-3">
                   {[
                      "Assistir aula de Fundações e Nivelamento",
                      "Comprar mourões tratados (4 unidades de 1.8m)",
                      "Areia e Brita para o alicerce",
                      "Tela galvanizada (malha pinteiro)",
                      "Instalar dobradiças na porta principal"
                   ].map((item, i) => {
                      const isChecked = progress[i];
                      return (
                      <li key={i} onClick={() => onToggle(i)} className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group select-none ${isChecked ? 'bg-brand/5 border-brand/30 hover:border-brand/50' : 'bg-surface-1/50 border-white/5 hover:border-brand/20 hover:bg-surface-2'}`}>
                         <div className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center transition-colors duration-300 ${isChecked ? 'bg-brand border-brand text-black shadow-[0_0_10px_rgba(139,195,74,0.4)]' : 'border-zinc-500 group-hover:border-brand/50 text-transparent'}`}>
                            <Check size={16} strokeWidth={3} />
                         </div>
                         <span className={`text-sm leading-relaxed transition-colors duration-300 ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                            {item}
                         </span>
                      </li>
                   )})}
                </ul>
             </div>
         </div>

         <div className="space-y-4">
            <div className="glass-panel p-6 bg-gradient-to-br from-surface-2 to-surface-1">
               <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                  <Calculator size={24} />
               </div>
               <h3 className="text-lg font-bold font-sora mb-2">Calculadora de Materiais</h3>
               <p className="text-sm text-zinc-400 mb-6 line-clamp-2">Calcule o custo exato dessa obra na sua cidade usando nossa ferramenta inteligente.</p>
               <button className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors flex items-center justify-center gap-2">
                  Abrir Calculadora
               </button>
            </div>

            <div className="glass-panel p-6 border-brand/20 bg-brand/5 relative overflow-hidden">
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand/20 rounded-full blur-2xl"></div>
               <div className="w-12 h-12 rounded-xl bg-brand/20 text-brand flex items-center justify-center mb-4 relative z-10">
                  <Download size={24} />
               </div>
               <h3 className="text-lg font-bold font-sora mb-2 text-brand relative z-10">Plantas e Medidas</h3>
               <p className="text-sm text-zinc-400 mb-6 relative z-10">Faça o download do PDF com o projeto arquitetônico completo.</p>
               <button className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-black font-semibold transition-all shadow-[0_0_20px_rgba(139,195,74,0.3)] hover:shadow-[0_0_30px_rgba(139,195,74,0.5)] flex items-center justify-center gap-2 relative z-10">
                  <Download size={18} /> Baixar PDF
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function CalculatorView() {
  return (
     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-4 inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/20">
           FERRAMENTA PREMIUM
        </div>
        <h2 className="text-3xl font-sora font-bold mb-3 tracking-tight">Calculadora Inteligente</h2>
        <p className="text-zinc-400 mb-10 text-lg max-w-2xl">Não tenha surpresas na hora de comprar o material. Insira o preço médio na sua cidade e tenha o orçamento fechado na hora.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-panel p-8">
              <h3 className="text-xl font-bold font-sora mb-6">Tabela de Preços (Sua Região)</h3>
              <div className="space-y-5">
                 {[
                    { label: "Madeira / Caibro (unidade 2m)", default: 25 },
                    { label: "Plástico Filme / Lona (metro)", default: 12 },
                    { label: "Tela Pinteiro Galvanizada (metro)", default: 8.5 },
                    { label: "Cimento (saco 50kg)", default: 32 }
                 ].map((item, i) => (
                    <div key={i}>
                       <label className="block text-sm font-medium text-zinc-300 mb-2">{item.label}</label>
                       <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium group-focus-within:text-brand transition-colors">R$</span>
                          <input 
                             type="number" 
                             defaultValue={item.default} 
                             className="w-full bg-surface-3 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div>
               <div className="glass-panel p-8 bg-gradient-to-br from-brand/10 to-transparent border-brand/20 sticky top-24">
                  <h3 className="text-xl font-bold mb-6 font-sora text-brand flex items-center gap-2">
                      <Calculator size={24} /> Resultado do Orçamento
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Estufa Túnel</span>
                          <span className="font-medium text-white">R$ 145,00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Galinheiro Funcional</span>
                          <span className="font-medium text-white">R$ 180,50</span>
                      </div>
                      <div className="w-full h-px bg-white/10 my-2"></div>
                      <div className="flex justify-between items-end">
                          <span className="text-zinc-300 font-medium">Economia Estimada*</span>
                          <span className="text-2xl font-bold text-brand">75%</span>
                      </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                      <div className="text-xl mt-0.5">💡</div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                          *Esta economia é calculada comparando o custo de construção rústica com reaproveitamento vs. a compra de estufas e galinheiros pré-fabricados de lojas agropecuárias.
                      </p>
                  </div>
               </div>
           </div>
        </div>
     </div>
  )
}

function DownloadsView() {
    return (
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-sora font-bold mb-3 tracking-tight">Central de Downloads</h2>
          <p className="text-zinc-400 mb-10 text-lg">Todos os arquivos de apoio e bônus do seu plano.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                  { name: "Livro em PDF: 5 Projetos", desc: "100+ páginas de guias passo a passo.", locked: false },
                  { name: "Plantas de Medidas", desc: "PDF com cortes e medidas exatas.", locked: false },
                  { name: "Planilha Automatizada .XLSX", desc: "Baixe a mesma calculadora do app para o PC.", locked: true },
                  { name: "Guia: Como Vender Mudas", desc: "Bônus extra de monetização rápida.", locked: true },
              ].map((item, i) => (
                  <div key={i} className={`glass-panel p-6 flex flex-col ${item.locked ? 'opacity-80' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.locked ? 'bg-surface-3 text-zinc-500' : 'bg-brand/10 text-brand'}`}>
                              {item.locked ? <Lock size={24} /> : <Download size={24} />}
                          </div>
                          {item.locked && <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[10px] font-bold uppercase tracking-wider">Premium</span>}
                      </div>
                      <h3 className="text-lg font-bold font-sora mb-1 text-white">{item.name}</h3>
                      <p className="text-sm text-zinc-400 mb-6">{item.desc}</p>
                      <button className={`mt-auto w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${item.locked ? 'bg-surface-3 text-zinc-500 cursor-not-allowed' : 'bg-brand text-black hover:bg-brand-hover hover:scale-[1.02]'}`}>
                          {item.locked ? 'Bloqueado no seu plano' : 'Baixar Arquivo'}
                      </button>
                  </div>
              ))}
          </div>
       </div>
    )
}

function CertificateView({ progress }: { progress: number }) {
   if (progress < 100) {
      return (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="w-24 h-24 rounded-full bg-surface-2 border border-white/5 flex items-center justify-center text-zinc-600 mb-6 shadow-xl relative overflow-hidden">
               <Award size={40} className="relative z-10" />
            </div>
            <h2 className="text-3xl font-sora font-bold mb-3 tracking-tight">Certificado Bloqueado 🔒</h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">
               Conclua 100% de todas as tarefas e aulas dos 5 projetos no seu Dashboard para destravar seu certificado oficial de conclusão.
            </p>
            <div className="w-full max-w-sm glass-panel p-6 bg-surface-2/20">
               <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Seu progresso atual</span>
                  <span className="font-bold text-brand">{progress}%</span>
               </div>
               <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-600" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="animate-in zoom-in-95 duration-500">
          <div className="mb-4 inline-block px-3 py-1 bg-brand/10 text-brand rounded-full text-xs font-semibold border border-brand/20 animate-pulse">
             VOCÊ CONSEGUIU! 🎉
          </div>
          <h2 className="text-4xl font-sora font-bold mb-3 tracking-tight text-white drop-shadow-[0_0_15px_rgba(139,195,74,0.3)]">Certificado de Conclusão</h2>
          <p className="text-zinc-300 mb-10 text-lg">Parabéns! Você concluiu todos os módulos. Seu certificado está pronto para emissão.</p>

          <div className="glass-panel p-1 md:p-8 bg-gradient-to-br from-brand/5 to-transparent border-brand/30 shadow-[0_0_50px_rgba(139,195,74,0.1)]">
             <div className="aspect-[1.4/1] bg-white rounded-lg p-8 relative flex flex-col items-center justify-center text-center border-8 border-surface-2/5 shadow-inner">
                {/* Visual Certificate Mock */}
                <div className="w-24 h-24 rounded-full bg-[#f0eedd] flex items-center justify-center shadow-lg mb-6 border-4 border-brand/20 text-4xl">
                   🏆
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-zinc-800 mb-2">CERTIFICADO</h1>
                <p className="text-zinc-500 tracking-widest uppercase text-sm mb-8 font-semibold">de conclusão de curso</p>
                <p className="text-zinc-600 text-lg max-w-lg mb-4">Certificamos que</p>
                <div className="w-full max-w-md border-b-2 border-zinc-800 pb-2 mb-4">
                   <h2 className="text-3xl font-bold font-sora text-black">Membro Exemplar</h2>
                </div>
                <p className="text-zinc-600 max-w-lg">Concluiu os estudos na plataforma de <strong>5 Projetos Rurais Premium</strong>, adquirindo conhecimento de auto-suficiência e bioconstrução.</p>
                
                <div className="absolute bottom-8 left-8">
                   <div className="w-32 h-px bg-zinc-300 mb-2"></div>
                   <p className="text-xs text-zinc-500 font-bold uppercase">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="absolute bottom-6 right-8 w-20 h-20 bg-brand/10 rounded-full border border-brand/30 flex items-center justify-center rotate-12">
                   <span className="text-brand font-bold text-xs">SEL0 OFICIAL</span>
                </div>
             </div>
          </div>

          <div className="mt-8 flex justify-center">
             <button className="px-8 py-4 rounded-xl bg-brand hover:bg-brand-hover text-black font-bold text-lg transition-all shadow-[0_0_20px_rgba(139,195,74,0.4)] hover:shadow-[0_0_30px_rgba(139,195,74,0.6)] hover:-translate-y-1 flex items-center gap-3">
                <Download size={24} /> Fazer Download em Alta Resolução (PDF)
             </button>
          </div>
      </div>
   );
}
