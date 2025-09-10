import { FaFile } from 'react-icons/fa';

export default function ResultFile({ file }) {
  return (
    <div className="search-result-item file">
      <FaFile className="file-icon" />
      <div>
        <h4>{file.name}</h4>
        <p>{file.info}</p>
      </div>
    </div>
  );
}
