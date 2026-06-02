import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getScooters } from "../services/api.js";

function Home() {
  const [scooters, setScooters] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScooters = async () => {
      const data = await getScooters();
      setScooters(data);
      setLoading(false);
    };

    loadScooters();
  }, []);

  const activeScooter = useMemo(() => {
    return scooters[activeIndex] || scooters[0];
  }, [activeIndex, scooters]);

  if (loading) {
    return (
      <main className="min-h-screen bg-asphalt text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-asphalt text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_62%,rgba(76,201,240,0.22),transparent_27%),radial-gradient(circle_at_58%_68%,rgba(239,35,60,0.22),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.94)_34%,rgba(5,5,5,0.72)_58%,#050505_100%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1540px] flex-col px-6 py-8 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between text-sm font-black uppercase text-white/70 sm:text-base">
          <button type="button" className="inline-flex items-center gap-2 transition hover:text-white">
            <span className="text-2xl leading-none">↖</span>
            <span>Back</span>
          </button>
          <span className="hidden tracking-[0.26em] text-white/35 sm:block">DTH GARAGE</span>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-end gap-5">
              <h1 className="text-[clamp(4.1rem,10.8vw,9.5rem)] font-black leading-[0.86] tracking-normal">
                DTH<br className="sm:hidden" /> Scooter
              </h1>
              <span className="pb-3 text-xl font-black tracking-[0.16em] text-white sm:pb-5 sm:text-2xl">
                2026
              </span>
            </div>

            <p className="mt-10 max-w-2xl text-2xl font-semibold leading-relaxed text-smoke sm:text-3xl">
              {activeScooter.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {["NVX", "CUSTOM", "GALLERY"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-5 py-2 text-sm font-black tracking-[0.14em] text-white/45"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to={`/gallery/${activeScooter._id}`}
                className="rounded-full bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-cyanbolt"
              >
                Xem gallery
              </Link>
              <div className="flex gap-2">
                {scooters.map((scooter, index) => (
                  <button
                    key={scooter._id}
                    type="button"
                    aria-label={`Chọn ${scooter.version}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-3 rounded-full transition-all ${
                      index === activeIndex ? "w-10 bg-white" : "w-3 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-[430px] lg:min-h-[620px]">
            <div className="absolute left-[2%] top-[6%] hidden w-[27%] overflow-hidden rounded bg-white/[0.03] opacity-45 shadow-glow sm:block">
              <img src={scooters[1]?.thumbnail || activeScooter.thumbnail} alt="" className="aspect-[4/3] w-full object-cover grayscale" />
            </div>

            <div className="absolute bottom-[12%] left-[9%] hidden w-[31%] overflow-hidden rounded border border-white/5 bg-white/[0.04] opacity-60 shadow-glow md:block">
              <img src={scooters[2]?.thumbnail || activeScooter.thumbnail} alt="" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-racing/30 to-transparent" />
            </div>

            <Link
              to={`/gallery/${activeScooter._id}`}
              className="group absolute right-0 top-1/2 block w-full max-w-[760px] -translate-y-1/2 overflow-hidden rounded-md border border-white/10 bg-white/[0.04] shadow-glow backdrop-blur-xl sm:w-[82%]"
            >
              <img
                src={activeScooter.thumbnail}
                alt={`${activeScooter.name} ${activeScooter.version}`}
                className="aspect-[16/9] w-full object-cover opacity-70 saturate-125 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-racing/32 via-black/10 to-cyanbolt/35" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <div className="rounded-md border border-white/10 bg-black/35 p-4 backdrop-blur-md sm:p-5">
                  <p className="text-xs font-black uppercase tracking-[0.26em] text-white/50">Featured build</p>
                  <h2 className="mt-2 text-2xl font-black sm:text-4xl">{activeScooter.version}</h2>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {["Dàn áo", "Động cơ", "Touring"].map((item) => (
                      <span key={item} className="rounded border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
