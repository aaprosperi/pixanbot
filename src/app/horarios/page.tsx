import Image from 'next/image';

export default function HorariosPage() {
  return (
    <main className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <Image
          src="/horarios.png"
          alt="Horarios Insurgentes BX"
          width={1400}
          height={800}
          className="w-full h-auto"
          priority
        />
        <p className="text-center text-gray-500 text-sm mt-4">
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </p>
      </div>
    </main>
  );
}
