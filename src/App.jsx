import { useState, useEffect } from 'react';

const HEADERS = {
  'X-Parse-Application-Id': import.meta.env.VITE_APP_ID,
  'X-Parse-REST-API-Key': import.meta.env.VITE_REST_KEY,
  'Content-Type': 'application/json'
};

const URL_TAREFAS = 'https://parseapi.back4app.com/parse/classes/Tarefa';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(URL_TAREFAS, { headers: HEADERS })
      .then((res) => res.json())
      .then((dados) => {
        setTarefas(dados.results || []);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error('Erro ao carregar tarefas:', erro);
        setCarregando(false);
      });
  }, []);

  function adicionarTarefa(e) {
    e.preventDefault();
    const tituloLimpo = titulo.trim();
    if (!tituloLimpo) return;

    fetch(URL_TAREFAS, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ titulo: tituloLimpo })
    })
      .then((res) => res.json())
      .then((criada) => {
        const novaTarefa = {
          objectId: criada.objectId,
          titulo: tituloLimpo
        };
        setTarefas((prev) => [...prev, novaTarefa]);
        setTitulo('');
      })
      .catch((erro) => console.error('Erro ao adicionar tarefa:', erro));
  }

  function excluirTarefa(objectId) {
    fetch(`${URL_TAREFAS}/${objectId}`, {
      method: 'DELETE',
      headers: HEADERS
    })
      .then((res) => res.json())
      .then(() => {
        setTarefas((prev) => prev.filter((t) => t.objectId !== objectId));
      })
      .catch((erro) => console.error('Erro ao excluir tarefa:', erro));
  }

  return (
    <main className="container py-4" style={{ maxWidth: '600px' }}>
      <h1 className="mb-4">Lista de Tarefas</h1>

      <form onSubmit={adicionarTarefa} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Digite uma tarefa..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </form>

      {carregando ? (
        <p>Carregando tarefas...</p>
      ) : tarefas.length === 0 ? (
        <p className="text-muted">Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul className="list-group">
          {tarefas.map((tarefa) => (
            <li
              key={tarefa.objectId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{tarefa.titulo}</span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => excluirTarefa(tarefa.objectId)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;