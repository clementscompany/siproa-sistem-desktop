import { useEffect, useState } from "react"
import Alert from "../Alert/Alert"
import { appEnv } from "../../env/appEnv"
export default function ContasBancarias() {
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [contas, setContas] = useState([])
  const [alert, setAlert] = useState({
    message: "",
    isOpen: false,
    status: '',
    title: "",
  })
  const [editingConta, setEditingConta] = useState(null)
  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    try {
      setIsLoading(true)
      const response = await fetch(`${appEnv.server}/contas-bancarias`)
      if (!response.ok) {
        setAlert({ ...alert, message: 'Erro ao carregar contas bancárias', isOpen: true, status: 'error', title: 'Erro' })
        return;
      }
      const data = await response.json()
      setContas(data.result || [])
      setIsLoading(false)
    } catch (error) {
      setAlert({ ...alert, message: error.message, isOpen: true, status: 'error', title: 'Erro' })
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${appEnv.server}/contas-bancarias/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erro ao remover conta')
      await fetchData()
      setAlert({
        ...alert,
        message: 'Conta bancária removida com sucesso!',
        isOpen: true,
        status: 'success',
        title: 'Sucesso'
      })
    } catch (error) {
      setAlert({
        ...alert,
        message: error.message,
        isOpen: true,
        status: 'error',
        title: 'Erro'
      })
    }
  }

  const handleEdit = (conta) => {
    setEditingConta(conta)
    setIsOpen(true)
  }

  return (
    <div>
      <h2>Contas Bancárias</h2>
      <ul style={{ listStyleType: 'none', paddingTop: 12 }}>
        {isLoading ? <li
          style={{
            color: '#666',
            fontSize: '16px',
            fontStyle: 'italic'
          }}
        >Carregando...</li> : null}
        {isLoading ? null : contas.length > 0 ? contas.map((conta, index) => <li key={conta.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <div>
            <strong>{conta?.banco || conta?.nome}</strong> - {conta?.iban}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleEdit(conta)}
              style={{
                background: '#ffc107',
                color: '#000',
                padding: '4px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >Editar</button>
            <button
              onClick={() => handleDelete(conta.id)}
              style={{
                background: '#dc3545',
                color: '#fff',
                padding: '4px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >Remover</button>
          </div>
        </li>) : null
        }
      </ul>
      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => {
            setEditingConta(null)
            setIsOpen(true)
          }}
          style={{
            background: '#007bff',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            border: 'none'
          }}
        >Adicionar</button>
      </div>


      {isOpen && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h3>{editingConta ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const contaData = {
              iban: formData.get('iban'),
              banco: formData.get('banco'),
            };
            if (editingConta) {
              contaData.id = editingConta.id;
            }
            try {
              const response = await fetch(`${appEnv.server}/contas-bancarias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contaData)
              });
              if (!response.ok) throw new Error('Erro ao salvar conta');
              await fetchData();
              setIsOpen(false);
              setEditingConta(null);
              setAlert({
                ...alert,
                message: `Conta bancária ${editingConta ? 'atualizada' : 'cadastrada'} com sucesso!`,
                isOpen: true,
                status: 'success',
                title: 'Sucesso'
              });
            } catch (error) {
              setAlert({
                ...alert,
                message: error.message,
                isOpen: true,
                status: 'error',
                title: 'Erro'
              });
            }
          }}>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>IBAN</label>
              <input
                type="text"
                name="iban"
                required
                defaultValue={editingConta?.iban}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="PT50 0000 0000 0000 0000 0000 00"
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Nome do banco</label>
              <input
                type="text"
                name="banco"
                required
                defaultValue={editingConta?.banco || editingConta?.nome}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Ex: Banco Português de Investimento"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  background: '#28a745',
                  color: '#fff',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingConta ? 'Atualizar' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setEditingConta(null)
                }}
                style={{
                  background: '#6c757d',
                  color: '#fff',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}


      {alert.isOpen && <Alert
        message={alert.message}
        isOpen={alert.isOpen}
        status={alert.status}
        title={alert.title}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />}
    </div>
  )
}