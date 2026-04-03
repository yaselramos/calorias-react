type CalorieDisplayProps = {
    calories: number
    text: string
}

export default function CalorieDisplay({calories, text} : CalorieDisplayProps) {
  return (
    <p className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-700 bg-slate-800/70 p-5 text-center text-sm font-semibold uppercase tracking-wide text-slate-300">
      <span className="text-4xl font-black text-lime-400 md:text-5xl">{calories}</span>
      {text}
    </p>
  )
}
