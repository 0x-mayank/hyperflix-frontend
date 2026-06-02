import { FaHeart } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#060608] pt-16 pb-10 overflow-hidden border-t border-white/5">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-200 mx-auto px-12 text-center">
        
        <div className="flex flex-col items-center mb-12">
          <div className="text-2xl font-black tracking-tighter mb-4">
            <span className="text-red-600">View</span>
            <span className="italic font-extralight text-white">Gasm</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-100">
            The ultimate cinematic protocol. Experience the visual surge of premium streaming.
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12 text-sm font-medium text-white/60">
          <li><a href="/" className="hover:text-red-500 transition-colors">Home</a></li>
          <li><a href="/movies" className="hover:text-red-500 transition-colors">Movies</a></li>
          <li><a href="/tv-shows" className="hover:text-red-500 transition-colors">TV Shows</a></li>
          <li><a href="/anime" className="hover:text-red-500 transition-colors">Anime</a></li>
        </ul>

        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
            © {currentYear} ViewGasm. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest">
            Made with <FaHeart className="text-red-600 animate-pulse" /> by Mayank
          </div>
        </div>
      </div>
    </footer>
  );
}