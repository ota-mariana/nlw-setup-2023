import { Plus } from 'phosphor-react';

function Header() {
  return (
    <div className="w-full max-w-3xl mx-auto felx items-center justify-between">
      <h1 className="text-white">LOGO HÁBITOS</h1>
      <button
        type="button"
        className=" border border-violet-500 font-semibold rounded-lg px-6 pv-4 flex items-center gap-3 hover:border-violet-300"
      >
        <Plus size={20} className="text-violet-500" />
        Novo Hábito
      </button>

    </div>
  )
}

export default Header;