import { useEffect, useRef, useState } from 'react';
import { FaFolder, FaFileAlt } from 'react-icons/fa';
import { FiLink, FiExternalLink } from 'react-icons/fi';
import { MdDone } from "react-icons/md";

function highlight(text = '', query = '') {
  if (!query) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'ig');

  return text.split(re).map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <span  className="matching-string" key={i}>{part}</span>
      : part  
  );
}


function SearchResultRow({ item, query }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(tooltipTimerRef.current);
  }, []);

  function handleCopy(e) {
    e.preventDefault();
    e.stopPropagation();
    const toCopy = item.link || item.url || item.name || item.title || '';
    if (!toCopy) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(toCopy).then(() => {
        setTooltipVisible(true);
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => setTooltipVisible(false), 1400);
      }).catch(() => {
        setTooltipVisible(true);
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => setTooltipVisible(false), 1400);
      });
    }
  }

  function handleOpenNewTab(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open('about:blank', '_blank', 'noopener,noreferrer');
  }

  return (
    <div className={`search-result-item ${item.type?.toLowerCase() || ''}`} role="group" tabIndex={0}>
      {item.type === 'Person' ? (
        <>
          <img src={item.avatar} alt={item.name} className="avatar" />
          <span className={`status-dot ${item.status?.toLowerCase().includes('now') ? 'green' : 'yellow'}`} />
        </>
      ) : item.type === 'File' ? (
        <FaFileAlt className="icon file-icon" />
      ) : (
        <FaFolder className="icon folder-icon" />
      )}

      <div className="result-text">
        <span className='text-title'>{highlight(item.name || item.title || '', query)}</span>
        <span className='text-description'>{highlight(item.status || item.info || '', query)}</span>
      </div>

      <div className="actions">
        <button
          className="action-btn copy-btn"
          onMouseDown={handleCopy}
          aria-label="Copy link"
          type="button"
        >
          <FiLink />
        </button>

        <button
          className="action-btn newtab-btn"
          onMouseDown={handleOpenNewTab}
          aria-label="Open new tab"
          type="button"
        >
          <FiExternalLink />
          
        </button>
        

        {tooltipVisible && <div className="copy-tooltip"><MdDone className='copied-icon'/><span>Link copied!</span></div>}
      </div>
    </div>
  );
}

export default function SearchResults({ results = [], activeTab = 'All', loading = false, query = '' }) {
const filteredByTab = results.filter(item => {
  if (activeTab === 'All') return true;
  if (activeTab === 'People') return item.type === 'Person';
  if (activeTab === 'Files') return item.type === 'File';
  if (activeTab === 'Folders') return item.type === 'Folder';
  if (activeTab === 'Chats') return item.type === 'Chat';
  if (activeTab === 'List') return item.type === 'List';
  return true;  
});

  if (loading) {
    return (
      <div className="result-group">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="search-result-item skeleton">
            <div className="skeleton-avatar" />
            <div className="skeleton-lines">
              <div className="skeleton-line long" />
              <div className="skeleton-line short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="result-group">
      {filteredByTab.map(item => (
        <SearchResultRow key={item.id} item={item} query={query} />
      ))}
    </div>
  );
}
