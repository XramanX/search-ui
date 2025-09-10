import { useEffect, useRef, useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import {  LuMessageSquare } from 'react-icons/lu';
import ToggleSwitch from '../Switch/ToggleSwitch';
import { GoPaperclip } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { BsList } from "react-icons/bs";


const tabConfig = [
  { name: 'Files', icon: <GoPaperclip /> },
  { name: 'People', icon: <FiUser /> },
  { name: 'Chats', icon: <LuMessageSquare /> },
  { name: 'List', icon: <BsList /> },
];

export default function SettingsDropdown({ enabledTabs, setEnabledTabs }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function toggleTab(tab) {
    setEnabledTabs(prev =>
      prev.includes(tab) ? prev.filter(t => t !== tab) : [...prev, tab]
    );
  }

  return (
    <div className="settings-wrap" ref={ref}>
      <button
        type="button"
        className={`settings-btn ${open ? 'open' : ''}`}
        onMouseDown={e => {
          e.preventDefault();
          setOpen(s => !s);
        }}
      >
        <FiSettings />
      </button>

      {open && (
        <div className="settings-dropdown" onMouseDown={e => e.stopPropagation()}>
          {tabConfig.map(({ name, icon }) => (
            <div className="settings-row" key={name}>
              <div className="settings-row-left">
                <span className="settings-row-icon">{icon}</span>
                <span className="settings-row-label">{name}</span>
              </div>
              <ToggleSwitch
                checked={enabledTabs.includes(name)}
                onChange={() => toggleTab(name)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
