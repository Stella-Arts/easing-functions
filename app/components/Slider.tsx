interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({ label, value, onChange, min = 0, max = 1, step = 0.01 }: SliderProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs font-mono">
      <div className="flex justify-between text-xs uppercase tracking-wider text-white">
        <label>{label}</label>
        <span>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-300 focus:outline-none focus:ring-1 focus:ring-white/20"
      />
    </div>
  );
}

