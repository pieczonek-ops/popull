import { VIRAL_NEWS } from '../constants';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="lg:col-span-4 space-y-12">
      <div className="sticky top-28">
        <div className="mb-8">
          <h3 className="font-headline text-xl font-bold border-l-4 border-primary pl-4 mb-6 uppercase tracking-tight">Viralowe teraz</h3>
          <div className="space-y-6">
            {VIRAL_NEWS.map((item) => (
              <div key={item.id} className="flex gap-4 items-center group cursor-pointer">
                <span className="text-4xl font-black text-surface-container-highest group-hover:text-primary transition-colors">
                  {item.rank}
                </span>
                <div>
                  <h6 className="font-bold text-sm leading-tight group-hover:text-primary group-hover:underline transition-colors line-clamp-2">
                    {item.title}
                  </h6>
                  <Link to={`/category/${item.category}`} className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest hover:text-primary transition-colors">
                    {item.category}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-container text-on-surface p-6 rounded-2xl border border-outline">
          <h3 className="font-headline font-bold text-lg mb-2 text-primary">Newsletter Pulse</h3>
          <p className="text-xs text-on-surface-variant mb-6">Najważniejsze historie prosto na Twój e-mail, codziennie o 8:00 rano.</p>
          <div className="space-y-3">
            <input 
              className="w-full bg-surface-container border border-outline rounded-full py-2.5 px-4 text-sm placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary outline-none transition-all" 
              placeholder="Twój adres email" 
              type="email" 
            />
            <button className="w-full bg-primary text-on-primary font-bold py-2.5 rounded-full text-sm hover:bg-white transition-colors">
              Zapisz się
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
