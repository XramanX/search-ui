export default function ToggleSwitch({ checked = false, onChange }) {
  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? 'on' : ''}`}
      onMouseDown={e => {
        e.preventDefault();
        onChange(!checked);
      }}
      aria-pressed={checked}
    >
      <span className="knob" />
    </button>
  );
}
