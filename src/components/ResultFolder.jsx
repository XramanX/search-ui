import { FaFolder } from 'react-icons/fa';

export default function ResultFolder({ folder }) {
  return (
    <div className="search-result-item folder">
      <FaFolder className="folder-icon" />
      <div>
        <h4>{folder.name}</h4>
        <p>{folder.info}</p>
      </div>
    </div>
  );
}
