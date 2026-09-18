import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Sparkles, label: 'Cupons de até 15% off' },
  { icon: Truck, label: 'Frete rápido para todo o Brasil' },
  { icon: ShieldCheck, label: 'Compra 100% segura' },
];

export function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-card bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 px-6 py-8 text-white sm:px-10 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
        Nova coleção de tecnologia
      </p>
      <h1 className="mt-2 max-w-lg text-2xl font-semibold sm:text-3xl">
        Equipe seu setup com o que há de melhor
      </h1>
      <p className="mt-2 max-w-md text-sm text-white/80">
        Periféricos, áudio e acessórios selecionados para o seu dia a dia — com o cupom certo, a
        economia aparece direto no carrinho.
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {HIGHLIGHTS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-xs text-white/90">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
