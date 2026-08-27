import { Menu, PenLine, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/", label: "Início" },
  { href: "/edicoes", label: "Edições" },
  { href: "/entrevistas", label: "Entrevistas" },
  { href: "/galeria", label: "Galeria" },
  { href: "/apoio", label: "Apoio" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">Ir para o conteúdo principal</a>
      <header className="border-b border-[#6c514233] bg-[#f8f4eacc] backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="editorial-link inline-flex items-center gap-3" aria-label="Voz Delas — ir para o início">
            <span className="grid size-9 place-items-center rounded-full border border-[#623536] text-[#623536]"><PenLine size={16} /></span>
            <span>
              <span className="editorial-kicker block leading-none">Jornal escolar</span>
              <span className="editorial-title block text-2xl font-bold leading-none">Voz Delas</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
            {links.map(link => <Link key={link.href} href={link.href} className={`editorial-kicker editorial-link ${location === link.href ? "text-[#743a3d]" : ""}`}>{link.label}</Link>)}
            <Link href="/editorial" className="inline-flex items-center gap-2 border border-[#623536] px-3 py-2 text-xs font-bold tracking-[0.09em] uppercase text-[#623536] transition-colors hover:bg-[#623536] hover:text-[#fffaf1]">Redação <span aria-hidden="true">→</span></Link>
          </nav>
          <button type="button" className="grid size-10 place-items-center lg:hidden" aria-expanded={open} aria-controls="menu-movel" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(value => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && <nav id="menu-movel" className="border-t border-[#6c514233] px-5 py-4 lg:hidden" aria-label="Navegação móvel">
          <div className="grid gap-1">
            {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`px-2 py-3 text-sm font-semibold ${location === link.href ? "bg-[#e8dbbf] text-[#623536]" : ""}`}>{link.label}</Link>)}
            <Link href="/editorial" onClick={() => setOpen(false)} className="mt-2 border border-[#623536] px-3 py-3 text-center text-xs font-bold tracking-[0.09em] uppercase text-[#623536]">Acessar redação</Link>
          </div>
        </nav>}
      </header>
    </>
  );
}

export function SiteFooter() {
  return <footer className="mt-20 border-t border-[#6c514233] bg-[#eee5d4]">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-11 md:grid-cols-[1.2fr_1fr] lg:px-8">
      <div>
        <p className="editorial-title text-3xl font-bold">Voz Delas</p>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#5c4b43]">Um espaço de escuta, aprendizagem e produção estudantil sobre respeito, direitos e enfrentamento à violência contra a mulher.</p>
      </div>
      <div className="border-l border-[#6c514233] pl-5">
        <p className="editorial-kicker text-[#623536]">Nota de cuidado</p>
        <p className="mt-2 text-sm leading-6 text-[#5c4b43]">Este jornal é educativo e não substitui atendimento de emergência. Em risco imediato, ligue <strong>190</strong>. Para acolhimento e orientação, procure o <a className="underline" href="https://www.gov.br/mulheres/pt-br/ligue180" target="_blank" rel="noreferrer">Ligue 180</a>.</p>
      </div>
    </div>
  </footer>;
}

export function PublicPage({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen"><SiteHeader /><main id="conteudo-principal">{children}</main><SiteFooter /></div>;
}
