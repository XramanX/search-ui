export default function ResultPerson({ person }) {
  return (
    <div className="search-result-item person">
      <img src={person.avatar} alt={person.name} className="avatar" />
      <div>
        <h4>{person.name}</h4>
        <p>{person.status}</p>
      </div>
    </div>
  );
}
