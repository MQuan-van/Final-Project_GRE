import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScooterById } from "../services/api.js";

function Gallery() {
  const { id } = useParams();
  const [scooter, setScooter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScooter = async () => {
      const data = await getScooterById(id);
      setScooter(data);
      setLoading(false);
    };

    loadScooter();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-asphalt text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      </main>
    );
  }

  const images = scooter.images || [];

  return (
    <main className="min-h-screen bg-asphalt text-white">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-8 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black uppercase text-white/70 transition hover:text-white sm:text-base">
            <span className="text-2xl leading-none">↖</span>
            <span>Back</span>
          </Link>
          <span className="text-sm font-black uppercase tracking-[0.24em] text-white/35">{scooter.version}</span>
        </header>

        <div className="mt-14">
          <h1 className="max-w-5xl text-[clamp(3.4rem,9vw,8rem)] font-black leading-[0.9]">
            {scooter.name}
          </h1>
          <p className="mt-7 max-w-3xl text-xl font-semibold leading-relaxed text-smoke sm:text-2xl">
            {scooter.description}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <article key={image._id || image.imageUrl} className="group overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="aspect-[4/3] w-full object-cover opacity-75 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-95"
              />
              <div className="border-t border-white/10 p-4">
                <h2 className="text-lg font-black">{image.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Gallery;
