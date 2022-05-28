function Team({ team }): JSX.Element {
  return (
    <ul>
      {team.map((name, i) => (
        <li key={i}>{name}</li>
      ))}
    </ul>
  )
}

export default Team
