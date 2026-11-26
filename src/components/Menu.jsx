export default function Menu({ username, onNavegar, onSalir }) {
  return (
    <div className="columna">
      <h2>Menú Principal</h2>
      <p className="saludo">Hola, {username}</p>
      <button onClick={() => onNavegar('sum')}>Sum</button>
      <button onClick={() => onNavegar('calculator')}>Calculator</button>
      <button className="btn-secundario" onClick={onSalir}>
        Salir
      </button>
    </div>
  );
}
