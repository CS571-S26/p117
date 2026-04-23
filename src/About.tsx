function About() {
  return (
    <section className="rounded border border-slate-300 bg-slate-50 p-6">
      <h1 className="mb-4 text-3xl font-semibold">About</h1>
      <div className="rounded border border-slate-300 bg-white p-4">
        <ul className="list-disc pl-5">
          <li>Monthly calendar view</li>
          <li>Task tracking</li>
          <li>Dashboard for logged-in users</li>
        </ul>
      </div>
    </section>
  );
}

export default About;
