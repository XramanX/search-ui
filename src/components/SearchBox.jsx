import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import SearchTabs from "./SearchTabs";
import SearchResults from "./SearchResults";
import SettingsDropdown from "./Dropdown/SettingsDropdown";
import dummyData from "../data/dummySearchData.json";
import "../styles/global.scss";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(dummyData);
  const [enabledTabs, setEnabledTabs] = useState(["All", "Files", "People"]);
  const [containerExpanded, setContainerExpanded] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const timerRef = useRef(null);
  const collapseTimerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query) {
      setLoading(false);
      setResults(dummyData);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      const filtered = dummyData.filter((item) =>
        (item.name || item.title || "").toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const desiredExpanded = focused && (query.length > 0 || loading);

  useEffect(() => {
    clearTimeout(collapseTimerRef.current);
    if (desiredExpanded) {
      setContainerExpanded(true);
      requestAnimationFrame(() => setResultsVisible(true));
    } else {
      setResultsVisible(false);
      collapseTimerRef.current = setTimeout(() => {
        setContainerExpanded(false);
      }, 500);
    }
    return () => clearTimeout(collapseTimerRef.current);
  }, [desiredExpanded]);

  useEffect(() => {
    function isEditable(el) {
      if (!el) return false;
      const tag = el.tagName;
      if (!tag) return false;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    }

    function shouldTriggerShortcut() {
      const active = document.activeElement;
      if (!active) return true;
      if (isEditable(active)) return false;
      const tag = active.tagName;
       if (tag === "BODY" || tag === "HTML") return true;
      return false;
    }

    function handleKeyDown(e) {
      if (e.key.toLowerCase() !== "s") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!shouldTriggerShortcut()) return;
       if (query && query.trim() !== "") return;
      e.preventDefault();
      inputRef.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query]);  

  const counts = {
    All: results.length,
    Files: results.filter((r) => r.type === "File").length,
    People: results.filter((r) => r.type === "Person").length,
    Folders: results.filter((r) => r.type === "Folder").length,
    Chats: results.filter((r) => r.type === "Chat").length,
    List: results.filter((r) => r.type === "List").length,
  };

  return (
    <div className={`search-container ${containerExpanded ? "expanded" : ""}`}>
      <div className="search-input-wrapper">
        <div className="icon-wrapper">
          <LuSearch className={`search-icon ${loading ? "hide" : "show"}`} />
          <span className={`inline-loader ${loading ? "show" : "hide"}`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Searching is easier"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value.trim() === "") {
              setContainerExpanded(false);
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="search-input"
        />
        {query ? (
          <button
            className="clear-text"
            onMouseDown={() => {
              setQuery("");
              setContainerExpanded(false);
            }}
          >
            Clear
          </button>
        ) : (
          <div className="quick-access">
          <div className="quick-access-key">
            <span className="key-hint">S</span>
          </div>
          <span className="quick-access-info">quick access</span>
          </div>
        )}
      </div>

      {desiredExpanded && (
        <div className="tabs-and-settings">
          <div className="tabs-area">
            <SearchTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              counts={counts}
              enabledTabs={enabledTabs}
            />
          </div>
          <div className="settings-area">
            <SettingsDropdown
              enabledTabs={enabledTabs}
              setEnabledTabs={setEnabledTabs}
            />
          </div>
        </div>
      )}

      <div className={`search-results ${resultsVisible ? "visible" : ""}`}>
        <SearchResults
          results={results}
          activeTab={activeTab}
          loading={loading}
          query={query}
        />
      </div>
    </div>
  );
}
