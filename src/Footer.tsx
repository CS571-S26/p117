function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f6f9ff_55%,#eef4ff_100%)] px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-lg font-semibold text-white">
                  31
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-800">Calendar</p>
                  <p className="text-sm text-slate-500">Plan your month, track your tasks</p>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
                A lightweight calendar project 
              </p>
            </div>


          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
