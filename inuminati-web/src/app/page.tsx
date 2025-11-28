export default async function Home() {
  const res = await fetch("http://localhost:8080/api/health");
  const data = await res.text();

  return (
    <div>
      <h1 className="text-4xl">Inuminati</h1>
      <p className="text-xl">{data}</p>
    </div>
  );
}
