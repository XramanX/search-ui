export default function SearchTabs({ activeTab, setActiveTab, counts = {}, enabledTabs = [] }) {
  return (
    <div className="search-tabs">
      {enabledTabs.map(tab => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onMouseDown={e => {
            e.preventDefault();
            setActiveTab(tab);
          }}
        >
          <span className="tab-label">{tab}</span>
          <span className="tab-count">{counts[tab] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
