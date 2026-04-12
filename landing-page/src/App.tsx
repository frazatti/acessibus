import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  Bus,
  ShieldCheck,
  Zap,
  Globe,
  Cpu,
  Code2,
  Database,
  MapPin,
  ArrowRight,
  Github,
  GraduationCap,
  Layers,
  Volume2,
  Accessibility,
  Info,
  Phone,
  Menu,
  X,
  Send,
} from "lucide-react";
import Logo from "./assets/Logo.png";

// --- Components ---

const SoundWave = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-24">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-gradient-to-t from-google-blue to-neon-purple rounded-full"
          animate={{
            height: [20, 60, 30, 80, 40, 20],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const AIOrb = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        className="absolute inset-0 bg-google-blue/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Inner Orb */}
      <motion.div
        className="relative w-48 h-48 bg-gradient-to-br from-google-blue via-neon-purple to-google-blue rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-1 bg-midnight rounded-full flex items-center justify-center">
          <Mic className="w-16 h-16 text-google-blue glow-pulse" />
        </div>
      </motion.div>

      {/* Orbiting Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-neon-purple rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            rotate: { duration: 5 + i, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity },
          }}
          style={{
            originX: "128px",
            originY: "128px",
            left: "0",
            top: "124px",
          }}
        />
      ))}
    </div>
  );
};

const BentoCard = ({
  title,
  description,
  icon: Icon,
  className = "",
}: {
  title: string;
  description: string;
  icon: any;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-8 transition-all hover:border-google-blue/50 hover:shadow-lg hover:shadow-google-blue/10 ${className}`}
    >
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-google-blue/10 text-google-blue transition-colors group-hover:bg-google-blue group-hover:text-white">
          <Icon size={24} />
        </div>
        <h3 className="mb-2 font-display text-xl font-bold text-slate-50">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-google-blue/5 blur-3xl transition-all group-hover:bg-google-blue/20" />
    </motion.div>
  );
};

const TechBadge = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-mono text-slate-300">
    <Icon size={16} className="text-google-blue" />
    {label}
  </div>
);

// --- Main App ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados para o Modal de Contato
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile: "",
    message: "",
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Função de envio para o WhatsApp
  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // O número de Sorocaba com DDI (55) e DDD (11)
    const phoneNumber = "5511934077881";

    const text = `Olá, equipe AcessiBus! Gostaria de ter acesso antecipado.\n\n*Nome:* ${formData.name}\n*E-mail:* ${formData.email}\n*Perfil:* ${formData.profile}\n*Mensagem:* ${formData.message || "Sem mensagem adicional."}`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(url, "_blank"); // Abre em nova aba
    setIsModalOpen(false); // Fecha o pop-up
    setFormData({ name: "", email: "", profile: "", message: "" }); // Limpa o form
  };

  return (
    <div className="min-h-screen bg-midnight font-sans selection:bg-google-blue/30">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-white pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-midnight/50 to-midnight pointer-events-none" />

      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-midnight/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"}`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={Logo} alt="AcessiBus Logo" className="h-10 w-auto" />
          </div>

          {/* Menu Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#problem"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-google-blue"
            >
              O Problema
            </a>
            <a
              href="#solution"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-google-blue"
            >
              Solução
            </a>
            <a
              href="#tech"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-google-blue"
            >
              Tecnologia
            </a>

            {/* Botão Faça Parte Desktop */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden rounded-full bg-google-blue px-6 py-2 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
            >
              <span className="relative z-10">Faça Parte</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </button>
          </div>

          {/* Botão Hambúrguer Mobile */}
          <button
            className="text-slate-50 md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Alternar menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Dropdown Menu Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full border-b border-white/10 bg-midnight/95 px-6 py-6 backdrop-blur-xl md:hidden flex flex-col gap-6 shadow-2xl"
            >
              <a
                href="#problem"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-google-blue"
              >
                O Problema
              </a>
              <a
                href="#solution"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-google-blue"
              >
                Solução
              </a>
              <a
                href="#tech"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-google-blue"
              >
                Tecnologia
              </a>

              {/* Botão Faça Parte Mobile */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="mt-2 rounded-xl bg-google-blue px-6 py-3 text-center text-base font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors active:bg-blue-600"
              >
                Faça Parte
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-google-blue/10 blur-[120px]" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl text-center font-display text-5xl font-extrabold leading-[1.1] text-slate-50 sm:text-7xl md:text-8xl"
        >
          A visão que faltava. <br />
          <span className="bg-gradient-to-r from-google-blue via-neon-purple to-google-blue bg-clip-text text-transparent">
            Guiada por voz.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-2xl text-center text-lg text-slate-400 md:text-xl"
        >
          Transformando a mobilidade urbana com IA Voice-First. Autonomia real
          para cegos e baixa visão no transporte público.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-8"
        >
          <AIOrb />
          <SoundWave />
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-32 px-6 bg-slate-950/50">
        <div className="container mx-auto">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-6xl">
                Para quem não vê, a{" "}
                <span className="text-google-blue">incerteza</span> é a maior
                barreira.
              </h2>
              <p className="mt-8 text-xl text-slate-400 leading-relaxed">
                No Brasil, cerca de 16,6 milhões de pessoas possuem algum grau
                de deficiência visual. A falta absoluta de sinalização sonora
                transforma o direito de ir e vir em um exercício diário de
                memorização de obstáculos e isolamento tecnológico.
              </p>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-google-blue">70%</div>
                  <div className="mt-2 text-sm text-slate-500 uppercase tracking-wider font-semibold">
                    Usam buracos e obstáculos como guia
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-neon-purple">67%</div>
                  <div className="mt-2 text-sm text-slate-500 uppercase tracking-wider font-semibold">
                    Sem acesso a apps de alerta sonoro
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full lg:aspect-square rounded-3xl bg-gradient-to-br from-google-blue/20 to-neon-purple/20 p-1 mt-8 lg:mt-0"
            >
              <div className="h-full w-full rounded-[calc(1.5rem-1px)] bg-midnight p-6 sm:p-8 flex flex-col justify-center">
                <div className="space-y-4 sm:space-y-6">
                  {[
                    "Qual ônibus está vindo?",
                    "Onde é o ponto de descida?",
                    "Este ônibus vai para o centro?",
                    "O ponto está longe?",
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/5 p-3 sm:p-4 border border-white/5"
                    >
                      <div className="h-2 w-2 shrink-0 rounded-full bg-slate-600" />
                      <span className="text-sm sm:text-base text-slate-400 italic">
                        "{text}"
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-google-blue">
                  <Accessibility size={28} className="shrink-0" />
                  <span className="text-base sm:text-lg font-bold leading-tight">
                    Acessibilidade não é opcional. É lei.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Solution (Bento Grid) */}
      <section id="solution" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="mb-20 text-center">
            <h2 className="font-display text-4xl font-bold text-slate-50 sm:text-5xl">
              'Solução
            </h2>
            <p className="mt-4 text-slate-400">
              Uma infraestrutura de mobilidade invisível e onipresente.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <BentoCard
              title="IA Conversacional"
              description="Tradução de dados complexos de GPS e rotas em voz natural e amigável. Diálogos fluidos para navegação sem estresse."
              icon={Mic}
              className="lg:col-span-2"
            />
            <BentoCard
              title="Ecossistema Conectado"
              description="Sincronização com cidades inteligentes e APIs de transporte para precisão em tempo real."
              icon={Globe}
              className="lg:col-span-2"
            />
            <BentoCard
              title="Rotas Favoritas"
              description="Perfil personalizado que aprende seus hábitos e sugere as melhores opções de mobilidade."
              icon={MapPin}
              className="lg:col-span-2"
            />
            <BentoCard
              title="Assistência 24/7"
              description="Suporte de IA sempre ativo para qualquer imprevisto durante o trajeto."
              icon={Accessibility}
              className="lg:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* Engineering Section */}
      <section id="tech" className="py-32 px-6 bg-slate-950/50">
        <div className="container mx-auto">
          <div className="flex flex-col items-center lg:flex-row lg:gap-16">
            {/* Lado Esquerdo: Pilares da Arquitetura */}
            <div className="mb-12 lg:mb-0 lg:w-1/2">
              <div className="mb-4 inline-flex items-center gap-2 text-google-blue font-mono text-sm uppercase tracking-widest">
                <Code2 size={16} />
                Arquitetura do Sistema
              </div>
              <h2 className="font-display text-4xl font-bold text-slate-50 sm:text-5xl">
                Engenharia orientada a <br />
                latência zero
              </h2>
              <p className="mt-6 text-slate-400 leading-relaxed">
                Nossa arquitetura foi desenhada com um único propósito: tempo de
                resposta imediato. Em um sistema de acessibilidade guiado por
                voz, milissegundos importam.
              </p>

              <div className="mt-10 space-y-8">
                {/* Pilar 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-google-blue/10 text-google-blue border border-google-blue/20">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-200">
                      Motor Cognitivo
                    </h4>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                      Utilizamos os melhores modelos de linguagem para processar
                      intenções de voz complexas, traduzindo perguntas naturais
                      em consultas estruturadas.
                    </p>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                    <Database size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-200">
                      Telemetria em Tempo Real
                    </h4>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                      Sincronização contínua com{" "}
                      <strong className="text-slate-300">
                        Google Maps API
                      </strong>{" "}
                      para garantir que os alertas de proximidade do autocarro
                      sejam exatos.
                    </p>
                  </div>
                  {/* Pilar 3: Interface do Condutor */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                      <Bus size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-200">
                        Alerta Inteligente ao Condutor
                      </h4>
                      <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                        Notificação imediata no terminal de bordo do motorista
                        via{" "}
                        <strong className="text-slate-300">WebSockets</strong>,
                        sinalizando a presença de passageiros com deficiência
                        visual no ponto exato.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pop-up Modal de Inscrição */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Fundo escuro com blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-midnight/80 backdrop-blur-sm"
            />

            {/* Caixa do Pop-up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
            >
              {/* Brilho no fundo do modal */}
              <div className="absolute top-0 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-google-blue/20 blur-[80px]" />

              {/* Botão de Fechar */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 transition-colors hover:text-white focus:outline-none"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-10">
                <h3 className="font-display text-2xl font-bold text-slate-50 sm:text-3xl mb-2">
                  Faça parte da revolução
                </h3>
                <p className="text-slate-400 mb-8">
                  Inscreva-se para acesso antecipado ou parcerias.
                </p>

                <form className="space-y-5" onSubmit={handleWhatsAppSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">
                        Nome
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue transition-all"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">
                        E-mail
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">
                      Perfil
                    </label>
                    <select
                      required
                      value={formData.profile}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-50 focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue transition-all appearance-none"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-slate-900 text-slate-500"
                      >
                        Selecione uma opção...
                      </option>
                      <option
                        value="Deficiente Visual"
                        className="bg-slate-900 text-slate-50"
                      >
                        Sou Deficiente Visual
                      </option>
                      <option
                        value="Familiar"
                        className="bg-slate-900 text-slate-50"
                      >
                        Sou Familiar de Deficiente Visual
                      </option>
                      <option
                        value="Governo"
                        className="bg-slate-900 text-slate-50"
                      >
                        Governo
                      </option>
                      <option
                        value="Empresa de ônibus"
                        className="bg-slate-900 text-slate-50"
                      >
                        Empresa de ônibus
                      </option>
                      <option
                        value="Investidor"
                        className="bg-slate-900 text-slate-50"
                      >
                        Investidor
                      </option>
                      <option
                        value="Outro"
                        className="bg-slate-900 text-slate-50"
                      >
                        Outro
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">
                      Mensagem
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue transition-all resize-none"
                      placeholder="Como podemos transformar a mobilidade?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-google-blue px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 mt-4"
                  >
                    <Send
                      size={20}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                    <span>Enviar para a Equipe</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-3 rounded-full bg-google-blue text-white px-10 py-5 text-xl font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:scale-95"
        >
          <Phone
            size={24}
            className="transition-transform group-hover:rotate-12"
          />
          <span>Entre em Contato</span>
        </button>
      </div>

      {/* Final CTA / Footer */}
      <footer className="relative overflow-hidden border-t border-white/5 bg-midnight pt-20 pb-10">
        <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-google-blue/5 blur-[120px]" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-12">
            {/* Coluna 1: Marca e Descrição */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2">
                <img src={Logo} alt="AcessiBus Logo" className="h-8 w-auto" />
                <span className="font-display text-xl font-bold tracking-tight text-slate-50">
                  AcessiBus
                </span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-slate-400">
                Tecnologia assistiva Voice-First para o transporte público.
                Devolvendo a autonomia e a segurança no direito de ir e vir, com
                inteligência artificial.
              </p>
              <div className="mt-8">
                <a
                  href="https://github.com/frazatti/acessibus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-google-blue/50 hover:bg-google-blue/10 hover:text-white"
                >
                  <Github size={18} />
                </a>
              </div>
            </div>

            {/* Coluna 2: Contato */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-slate-50">Contato</h4>
              <ul className="flex flex-col gap-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-sensepad-accent mt-1 flex-shrink-0"
                  />
                  <span>
                    Rod. Raposo Tavares, km 92.5
                    <br />
                    Vila Artura, Sorocaba - SP
                    <br />
                    18023-000
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Barra inferior (Copyright) */}
          <div className="mt-20 flex flex-col items-center justify-between border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} AcessiBus Project. Todos os direitos
              reservados.
            </p>
            <p className="mt-4 text-sm text-slate-500 sm:mt-0 flex items-center gap-1">
              Desenvolvido para gerar impacto social.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
